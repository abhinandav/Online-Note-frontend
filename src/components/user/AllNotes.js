import React, { useEffect, useState } from 'react';
import { AuthUserAxios } from '../axios-instance/instance';
import { TSuccess } from '../toastify/Toastify';
import { IoMdClose } from 'react-icons/io';
import { FaEdit } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { jwtDecode } from 'jwt-decode'
import { TWarning } from '../toastify/Toastify'
import Cards from './Cards';
import { Link } from 'react-router-dom';


function AllNotes() {
    const [Access, setAccess] = useState(localStorage.getItem('access'))
    const [modal, setModal] = useState(false);
    const [Title, setTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [notesList, setNotesList] = useState([])
    const [editId, setEditId] = useState(null)
    

  
    const fetch_list=()=>{
        if(Access){
            AuthUserAxios.get(`/note/list/${jwtDecode(Access).user_id}`, {
                headers:{
                    Authorization: `Bearer ${Access}`,
                }
            }).then((res)=>{
                setNotesList(res.data)
                console.log(res.data);
            }).catch((err)=>{
                console.log(err);
            })}
    }
    
      useEffect(()=>{
        fetch_list()
    },[])


  return (
    <div style={{minHeight:1000}} className='bg-gray-300 '>

        

        <div className='flex flex-col w-2/3 ml-60 mb-20'>
                    <Link className='mt-10' to='/'>
                        <span className='cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-6'>
                            Go Back
                        </span>
                    </Link>
            

                    <div className='mr-20'>           
                        {notesList.map((res) => (
                            <div key={res.id}>
                            <Cards id={res.id} setEditId={setEditId}  setNotesList={setNotesList} data={res} />
                            </div>
                        ))
                    }
                </div>
        </div>
    </div>
  )
}

export default AllNotes