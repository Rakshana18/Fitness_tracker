import { ActivityIcon, HomeIcon, PersonStandingIcon, UserIcon, UtensilsIcon } from "lucide-react"
import { NavLink } from "react-router-dom"


const Sidebar = () => {
    const navItems = [
        {path:'/',label:'Home',icon:HomeIcon},
        {path:'/food',label:'Food',icon:UtensilsIcon},
        {path:'/activity',label:'Activity',icon:ActivityIcon},
        {path:'/profile',label:'Profile',icon:UserIcon},
    ]

   
  return (
    <nav className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-6 transition-colors
    duration-200">
        <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-emerald-500 flex items-cneter justify-center">
                <PersonStandingIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FitTrack</h1>
        </div>

        <div className="flex flex-col gap-2">
            {navItems.map((item)=>(
                <NavLink key={item.path} to={item.path}
                className={({ isActive })=> `flex items-center gap-3 px-4 py-2.5
                border-l-3 transition-all duration-200 ${isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 
                    'text-slate-500 hover:bg:slate-50 hover:text-slate-700 border-transparent'}`}>
                    <item.icon className="size-5"/>
                    <span className="text.base">{item.label}</span>
                </NavLink>
            ))}
        </div>
    </nav>
  )
}

export default Sidebar
