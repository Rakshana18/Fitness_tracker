import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"
import {type ProfileFormData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, Scale, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";


const Profile = () => {
  const {user,logout,fetchUser,allFoodLogs,allActivityLogs} = useAppContext();

  const [isEditing,setIsEditing] = useState(false);
  const [formData,setFormData] = useState<ProfileFormData>({age:0,weight:0,height:0,goal:'maintain',
    dailyCalorieIntake:2000,dailyCalorieBurn:40 })

  const fetchUserData = ()=>{
    if(user){
      setFormData({
        age:user?.age || 0,
        weight:user?.weight || 0,
        height:user?.height || 0,
        goal:user?.goal || 'maintain',
        dailyCalorieIntake:user?.age || 2000,
        dailyCalorieBurn:user?.age || 400,
      })
    }
  }

  useEffect(()=>{
    (()=>{
      fetchUserData()
    })();
  },[user])

  const HandleSave = async ()=>{
    try {
      await api.put(`/api/users/${user?.id}`, formData)

      await fetchUser(user?.token || '' )
      toast.success('profile updated successfully')
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
    setIsEditing(false)
  }

  const getStats = ()=>{
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;
    return {totalFoodEntries, totalActivities}
  }

  const stats = getStats();

  if(!user || !formData) return null

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage yout settings</p>
      </div>

      <div className="profile-content">
        {/* left col */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 
            flex items-center justify-center">
              <User className="size-6 text-white"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Your profile</h2>
              <p className="text-slate-500 text-xs">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input label="Age" type="number" value={formData.age} onChange={(v)=>setFormData({...formData,age: Number(v)})}
              min={13} max={120}/>
              <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v)=>setFormData({...formData,weight: Number(v)})}
              min={20} max={300}/>
              <Input label="Height (cm)" type="number" value={formData.height} onChange={(v)=>setFormData({...formData,height: Number(v)})}
              min={100} max={250}/>

              <Select label="Fitness Goal" value={formData.goal as string}
              onChange={(v)=>setFormData({...formData,goal:v as 'lose' | 'maintain' | 'gain'})} options={goalOptions}/>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" 
                onClick={()=>{
                  setIsEditing(false);
                  setFormData({
                    age: Number(user.age),
                    weight: Number(user.weight),
                    height: Number(user.height),
                    goal: user.goal || '',
                    dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                    dailyCalorieBurn: user.dailyCalorieBurn || 400
                  })
                }}>
                  Cancel
                </Button>
                <Button onClick={HandleSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="size-4.5 text-blue-600"/>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Age</p>
                  <p className="font-semibold text-slate-800">{user.age} years</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Scale className="size-4.5 text-purple-600"/>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Weight</p>
                  <p className="font-semibold text-slate-800">{user.weight} kg</p>
                </div>
              </div>

              {user.height !== 0 && (
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <User className="size-4.5 text-green-600"/>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Height</p>
                  <p className="font-semibold text-slate-800">{user.height} cm</p>
                </div>
              </div>
              )}

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Target className="size-4.5 text-orange-600"/>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Goal</p>
                  <p className="font-semibold text-slate-800">{goalLabels[user?.goal || 'gain']}</p>
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={()=>setIsEditing(true)} className="w-full mt-4">
              Edit profile
            </Button>
            </>
          )}
        </Card>
        {/* right col */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 ">{stats.totalFoodEntries}</p>
                <p className="text-sm text-slate-500">Food Entries</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600 ">{stats.totalActivities}</p>
              <p className="text-sm text-slate-500">Activities</p>
            </div>
            </div>
            
          </Card>
          <Button variant="danger" onClick={logout} className="w-full ring ring-red-300 hover:ring-2">
            <LogOutIcon className="size-4"/>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
