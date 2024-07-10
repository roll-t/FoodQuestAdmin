'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import router from 'next/router';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const handleClick = ()=>{
    toast.success("them thanh cong");
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
    
  }
  
  return (
    <div>
      <div className="_login">
        <Button variant='primary' onClick={handleClick}>
          Login With Google
          </Button>
      </div>
      <ToastContainer/>
    </div>

  )
}
