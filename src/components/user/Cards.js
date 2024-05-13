import React, { useEffect, useState } from 'react';
import { AuthUserAxios } from '../axios-instance/instance';
import { TSuccess } from '../toastify/Toastify';
import { IoMdClose } from 'react-icons/io';
import { FaEdit } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { jwtDecode } from 'jwt-decode'
import { TWarning } from '../toastify/Toastify'

function Cards({ id,data, setEditId, setNotesList }) {
  const [Access, setAccess] = useState(localStorage.getItem('access'))
  const [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState(false);
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')



  const handleDelete = async (id) => {
    await AuthUserAxios.delete(`/note/delete/${id}`)
      .then((res) => {
        TSuccess('Deleted ...‼️');
        setNotesList((res) => {
          console.log(res);
          return res.filter((val) => val.id !== id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const fetchData = () => {
    console.log(id);
    AuthUserAxios.get(`/note/edit/${id}`)
      .then((res) => {
        console.log(res);
        setTitle(res.data.title);
        setDescription(res.data.description);
      })
      .catch((err) => {
        console.log(err);
      });
  
    AuthUserAxios.get(`/note/list/${jwtDecode(Access).user_id}`, {
      headers: {
        Authorization: `Bearer ${Access}`,
      }
    })
      .then((res) => {
        setNotesList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  useEffect(()=>{
    fetchData()
},[id])

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };



  const handleSubmit = async () => {
    if (Title.trim() === '') {
      TWarning('Title is empty');
    } else if (Description.trim() === '') {
      TWarning('Description is empty');
    }
    
    const formData = {
      title: Title,
      description: Description,
      user: jwtDecode(Access).user_id
    };
  
    await AuthUserAxios.patch(`/note/edit/${id}`, formData)
      .then((res) => {
        console.log(res);
        console.log('Ok this is updated');
        fetchData(); // Fetch updated data
        setEditId(null);
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  


  const formattedDate = formatDistanceToNow(new Date(data.created_at), { addSuffix: true });

  const showReadMoreButton = data.description.split(' ').length > 200 || data.description.length > 200;

  return (
    <div className={`mt-6 text-gray-700 bg-white shadow-md rounded-xl ${expanded ? 'h-auto' : 'h-50 overflow-hidden'}`}>
      <div className="flex flex-row justify-between">
        <div className="p-5">
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            {data.title}
          </h5>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            {expanded ? data.description : data.description.length > 200 ? data.description.substring(0, 200) + '...' : data.description}
          </p>

          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            {formattedDate}
          </p>
          {showReadMoreButton && (
            <button className="text-blue-500 mt-2" onClick={toggleExpanded}>
              {expanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        <div className="p-6 flex flex-col ">
          <button className="text-red-500" type="button" onClick={() => handleDelete(data.id)}>
            <IoMdClose className="text-2xl" />
          </button>
          <button
            className="text-xl mt-2 ml-1 text-blue-500"
            type="button"
            onClick={() => {setEditId(data.id); setModal(true)}}
          >
            <FaEdit />
          </button>

          {modal &&(
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-3xl font-bold text-center leading-6 text-gray-900" id="modal-title">Edit Item</h3>
                                    


                                    <div className="mt-10 w-full">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                                            <input type="text" value={Title} onChange={(e)=>setTitle(e.target.value)} id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Title" required />
                                        </div>
                                        <div className="mt-5 w-full">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 ">Whats new?</label>
                                            <textarea id="message" value={Description} onChange={(e)=>setDescription(e.target.value)} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button"  onClick={()=>handleSubmit()}  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Edit</button>
                            <button type="button" onClick={()=>{  setModal(false)}} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cards;
