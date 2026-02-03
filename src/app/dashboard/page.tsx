import { getCreatorStats } from '@/app/actions/project'
import Link from 'next/link'
import { LayoutDashboard, Eye, BarChart2, TrendingUp, ExternalLink, Home, PlusCircle } from 'lucide-react'

export default async function DashboardPage() {
  const projects = await getCreatorStats()

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
             <LayoutDashboard size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No Projects Yet</h2>
          <p className="text-gray-500 mb-8">Start your journey by registering your first project. We'll ensure it gets fair exposure.</p>
          <Link href="/projects/create" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200">
             <PlusCircle size={20} />
             Create Project
          </Link>
        </div>
      </div>
    )
  }

  // Generic Stats
  const totalViews = projects.reduce((acc, p) => acc + p.viewCount, 0)
  const totalImpressions = projects.reduce((acc, p) => acc + p.impressionCount, 0)
  const avgCtr = totalImpressions > 0 ? (totalViews / totalImpressions) * 100 : 0
  
  // Fairness Score Calculation (Mock Logic for MVP)
  // Assume global average impression is around 50 (In real app, fetch from DB)
  const GLOBAL_AVG_IMPRESSIONS = 50 
  const fairnessScore = totalImpressions > 0 
      ? Math.min(((totalImpressions / projects.length) / GLOBAL_AVG_IMPRESSIONS) * 100, 100).toFixed(0)
      : 0

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                   <LayoutDashboard size={24} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Creator Dashboard</h1>
             </div>
             <p className="text-gray-500 font-medium ml-1">Track your performance and fair exposure metrics.</p>
           </div>
           
           <div className="flex items-center gap-3">
             <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               <Home size={18} />
               <span>Home</span>
             </Link>
             <Link href="/projects/create" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white border border-gray-900 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
               <PlusCircle size={18} />
               <span>New Project</span>
             </Link>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                    <Eye size={24} />
                 </div>
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Views</h3>
              <p className="text-3xl font-black text-gray-900">{totalViews.toLocaleString()}</p>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                    <BarChart2 size={24} />
                 </div>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Fair Impressions</h3>
              <p className="text-3xl font-black text-gray-900">{totalImpressions.toLocaleString()}</p>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                 </div>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Avg. CTR</h3>
              <p className="text-3xl font-black text-gray-900">{avgCtr.toFixed(1)}%</p>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl shadow-blue-200 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
               <div className="relative z-10">
                  <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Fairness Score</h3>
                  <div className="flex items-end gap-2 mb-1">
                     <p className="text-4xl font-black">{fairnessScore}</p>
                     <span className="text-sm font-medium text-blue-200 mb-1">/ 100</span>
                  </div>
                  <p className="text-xs text-blue-100 opacity-80 mt-2">
                     Your projects are receiving {fairnessScore}% of the optimal fair exposure.
                  </p>
               </div>
           </div>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-gray-100 flex items-center justify-between">
             <h3 className="text-xl font-bold text-gray-900">Project Performance</h3>
             <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Download CSV</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50/50">
                 <tr>
                   <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Project Details</th>
                   <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Views</th>
                   <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Impressions</th>
                   <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">CTR</th>
                   <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {projects.map((project) => {
                   const ctr = project.impressionCount > 0 
                     ? (project.viewCount / project.impressionCount * 100) 
                     : 0
                   
                   return (
                     <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm relative group-hover:shadow-md transition-all">
                               {project.thumbnailUrl ? (
                                 <img src={project.thumbnailUrl} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                               )}
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 text-base">{project.title}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 font-bold rounded">{project.category}</span>
                                  <Link href={`/projects/${project.id}`} className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View <ExternalLink size={10} />
                                  </Link>
                               </div>
                            </div>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-right font-bold text-gray-700">{project.viewCount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right font-bold text-gray-900">{project.impressionCount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(ctr, 100)}%` }}></div>
                             </div>
                             <span className="font-bold text-green-600 text-sm">{ctr.toFixed(1)}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Active
                          </span>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
           
           <div className="p-8 border-t border-gray-100 bg-gray-50/50 text-center">
              <p className="text-gray-400 text-sm">Showing {projects.length} projects</p>
           </div>
        </div>
      </div>
    </div>
  )
}
