import CommonForm from "@/components/common/CommonForm";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/authslice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


const AuthRegister = () => {

  const initalState ={
    userName:'',
    email:'',
    password:'',
  }

  
  


  const [formData,setFormData] = useState(initalState);
  const dispacth = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast()


  function onSubmit(event){
    event.preventDefault();
    dispacth(registerUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast({
          title: data?.payload?.message,
        });
        navigate('/auth/login')
      }else{
        toast({
          title: data?.payload?.message,
          variant:"destructive",
        });
      }
      console.log(data)
    } )
  }
  console.log(formData);
  


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        
      </div>
      <CommonForm formControls={registerFormControls}
      buttonText={'Sign Up'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
      <p className="mt-1 text-center">
          Already have an accout
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
    </div>
  );
};

export default AuthRegister;
