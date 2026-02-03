import { getUserProfile } from '@/app/actions/profile'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { User, Globe, Calendar, Heart, Eye, BarChart2, Edit } from 'lucide-react'
import { auth } from '@/auth'

type Props = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const session = await auth()
  const data = await getUserProfile(username)

  if (!data) {
    notFound()
  }

  const { user, stats } = data
  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-semibold">
              ← Back to Home
            </Link>
            {isOwnProfile && (
              <Link 
                href="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-colors"
              >
                <Edit size={16} />
                Edit Profile
              </Link>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl font-black border-4 border-white/30">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={64} />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{user.name || 'Anonymous Creator'}</h1>
              <p className="text-blue-100 text-lg mb-4">@{user.username || user.id.slice(0, 8)}</p>
              
              {user.bio && (
                <p className="text-white/90 text-lg mb-4 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Globe size={16} />
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={16} />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-gray-400 mb-2 flex justify-center">
              <BarChart2 size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 text-center">{stats.totalProjects}</div>
            <div className="text-sm text-gray-500 text-center mt-1">Projects</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-red-400 mb-2 flex justify-center">
              <Heart size={24} className="fill-red-400" />
            </div>
            <div className="text-3xl font-black text-gray-900 text-center">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-sm text-gray-500 text-center mt-1">Total Likes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-blue-400 mb-2 flex justify-center">
              <Eye size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 text-center">{stats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-500 text-center mt-1">Total Views</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-purple-400 mb-2 flex justify-center">
              <BarChart2 size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 text-center">{stats.totalImpressions.toLocaleString()}</div>
            <div className="text-sm text-gray-500 text-center mt-1">Impressions</div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Projects</h2>
        
        {user.projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map(project => (
              <ProjectCard key={project.id} project={{ ...project, user }} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-gray-300 text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500">
              {isOwnProfile ? "Start sharing your work!" : "This creator hasn't shared any projects yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
