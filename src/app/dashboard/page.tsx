import { getCreatorStats } from '@/app/actions/project'
import Link from 'next/link'

export default async function DashboardPage() {
  const projects = await getCreatorStats()

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No projects found</h2>
          <Link href="/projects/create" className="text-blue-600 hover:underline">Create your first project</Link>
        </div>
      </div>
    )
  }

  // Calculate generic stats
  const totalViews = projects.reduce((acc, p) => acc + p.viewCount, 0)
  const totalImpressions = projects.reduce((acc, p) => acc + p.impressionCount, 0)
  const avgCtr = totalImpressions > 0 ? (totalViews / totalImpressions) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
           <div>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">Creator Dashboard</h1>
             <p className="text-gray-500 font-medium mt-1">Track your fair exposure performance</p>
           </div>
           <Link href="/" className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
             Go to Home
           </Link>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Views</h3>
              <p className="text-4xl font-black text-gray-900">{totalViews.toLocaleString()}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Impressions</h3>
              <p className="text-4xl font-black text-blue-600">{totalImpressions.toLocaleString()}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Avg. CTR</h3>
              <p className="text-4xl font-black text-green-600">{avgCtr.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-2">Click Through Rate</p>
           </div>
        </div>

        {/* Project List Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-gray-100">
             <h3 className="text-xl font-bold text-gray-900">Project Performance</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50/50">
                 <tr>
                   <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Project</th>
                   <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Views</th>
                   <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Impressions</th>
                   <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">CTR</th>
                   <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Category</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {projects.map((project) => {
                   const ctr = project.impressionCount > 0 
                     ? (project.viewCount / project.impressionCount * 100).toFixed(1) 
                     : '0.0'
                   
                   return (
                     <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            {project.thumbnailUrl && (
                              <img src={project.thumbnailUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{project.title}</p>
                              <Link href={`/projects/${project.id}`} className="text-xs text-blue-500 hover:underline">View Page &rarr;</Link>
                            </div>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-right font-bold text-gray-700">{project.viewCount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right font-bold text-blue-600">{project.impressionCount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right font-bold text-green-600">{ctr}%</td>
                       <td className="px-8 py-6 text-right">
                         <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">{project.category}</span>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  )
}
