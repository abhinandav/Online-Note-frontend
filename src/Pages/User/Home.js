import React, { useEffect, useState } from 'react'
import Header from '../../components/user/Header'
import Cards from '../../components/user/Cards'
import Modal from '../../components/user/Modal'
import { UserAxios } from '../../components/axios-instance/instance'
import { jwtDecode } from 'jwt-decode'
import { TWarning } from '../../components/toastify/Toastify'
import { AuthUserAxios } from '../../components/axios-instance/instance'
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom'



function Home() {
    const [notesList, setNotesList] = useState([])
    const [Access, setAccess] = useState(localStorage.getItem('access'))
    const [editId, setEditId] = useState(null)

    const [Title, setTitle] = useState('')
    const [showAll, setShowAll] = useState(false); 
    const [Description, setDescription] = useState('')
    


const fetch_list=()=>{
    if(Access){
        UserAxios.get(`/note/list/${jwtDecode(Access).user_id}`, {
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



    const handleSubmit = async () =>{
        if(Title.trim() === ''){
            TWarning('Title is empty')
        }else if(Description.trim() === ''){
            TWarning('Description is empty')
        }
        const formData = {
            title:Title,
            description:Description,
            user:jwtDecode(Access).user_id
        }
        await AuthUserAxios.post('/note/create', formData).then((res)=>{
            console.log(res);
            fetch_list()
            setTitle('')
            setDescription('')
        }).catch((err)=>{
            console.log(err);
        }) 
    }

    return (
        <div className='bg-gray-300 w-screen min-h-screen'>
            <div className='w-full h-fit'>
                <Header />
            </div>

                <div className='flex flex-row justify-between'>
                    
                        <div className="ml-20   w-1/4    sm:my-8 sm:w-full h-96   sm:max-w-lg">
                            <div className="bg-white mt-20 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-3xl font-bold text-center leading-6 text-gray-900" id="modal-title">Add New Ideas</h3>
                                        
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
                                <button type="button" onClick={()=>handleSubmit()} className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add</button>
                                <button type="button" onClick={()=>{setTitle(''); setDescription('')}} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                        </div>

                        <div className='flex flex-col w-2/3 ml-40 mb-20'>
                            <div className='mr-20 mt-10 '>
                                {notesList.length === 0 ? (
                                <div>Nothing to display</div>
                                ) : (
                                <>
                                    {showAll ? (
                                    notesList.map((res) => (
                                        <div key={res.id}>
                                        <Cards id={res.id} setEditId={setEditId} setNotesList={setNotesList} data={res} />
                                        </div>
                                    ))
                                    ) : (
                                    notesList.slice(0, 3).map((res) => (
                                        <div key={res.id}>
                                        <Cards id={res.id} setEditId={setEditId} setNotesList={setNotesList} data={res} />
                                        </div>
                                    ))
                                    )}
                                    {/* Render the "Show More" button if the length of notesList is greater than 3 */}
                                    {notesList.length > 3 && (
                                    <span className='flex justify-between'>
                                        {/* Empty span */}
                                        <span></span>
                                        <Link to='all_notes/' className='mt-4'>
                                        <span className="mt-4 mr-3 cursor-pointer justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm">
                                            Show More
                                        </span>
                                        </Link>
                                    </span>
                                    )}
                                </>
                                )}
                            </div>
                        </div>

                </div>
        </div>
    )
}

export default Home








