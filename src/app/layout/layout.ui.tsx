import { Outlet } from 'react-router-dom'
import { ScrollTop } from '~shared/lib/react-router'
import { Footer } from '~widgets/footer'
import { Header } from '~widgets/header'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function GenericLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export function IntroLayout() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Outlet /> 
    </div>
  )
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setIsAuthenticated(false);
        navigate("/error"); 
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth(); 

    window.addEventListener("authChange", checkAuth);
    
    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
}

