import { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { useAuth } from "../../context/auth/AuthContext"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { useParams, useNavigate } from "react-router-dom"
import { getCourseWithContent, createCourse, updateCourse, uploadCourseImage } from "../../services/courses.service"
import { createModule, updateModule, deleteModule } from "../../services/module.service"
import { createLesson, updateLesson, deleteLesson, uploadLessonVideo } from "../../services/lessons.service"

const CourseEditor = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    name:'',
    description:'',
    category:'',
    urlImg:''
  })
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [modules, setModules] = useState([])
  const [newModuleName, setNewModuleName] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [editingModuleId, setEditingModuleId] = useState(null)
  const [editingModuleName, setEditingModuleName] = useState('')
  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [newLessonData, setNewLessonData] = useState({
    name:'',
    description:'',
    linkVideo:''
  })
  const [addingLesson, setAddingLesson] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [editingLessonData, setEditingLessonData] = useState({
    name:'',
    description:'',
    linkVideo:''
  })
  const [videoFile, setVideoFile] = useState(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  useEffect(() => {
    if(!isEditMode) return
    const fetchCourse = async() => {
      try {
      
        const data = await getCourseWithContent(id)
        setFormData({
          name:data.course.name,
          description:data.course.description,
          category:data.course.category,
          urlImg: data.course.urlImg
        })
        setModules(data.course.modules)
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }  
    fetchCourse()
  }, [id])

  const onChangeInput = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleImageUpload = async() => {
    if(!imageFile) return

    setUploadingImage(true)
    setError('')

    try {
      await uploadCourseImage(id, imageFile, token)
      setImageFile(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {

      const { name, description, category} = formData
      if(isEditMode){
        await updateCourse(id, { name, description, category}, token)
      } else {
        const data = await createCourse({ name, description, category}, token)
        navigate(`/teacher/courses/${data.newCourse._id}/edit`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddModule = async() => {
    if(!newModuleName.trim()) return

    setAddingModule(true)
    setError('')
    try {
      const data = await createModule(id, newModuleName, token)
      setModules([
        ...modules,
        data.newModule
      ])
      setNewModuleName('')
    } catch (e) {
      setError(e.message)
    } finally {
      setAddingModule(false)
    }
  }

  const handleDeleteModule = async(moduleId) => {
    setError('')
    try {
      await deleteModule(moduleId, token)
      setModules(modules.filter((m) => m._id !== moduleId))
    } catch (e) {
      setError(e.message)
    }
  }

  const startEditModule = (module) => {
    setEditingModuleId(module._id)
    setEditingModuleName(module.name)
  }

  const handleUpdateModule = async() => {
    if(!editingModuleName.trim()) return
    setError('')

    try {
      const data = await updateModule(editingModuleId, editingModuleName, token)
      setModules(modules.map((m) => (m._id === editingModuleId ? data.updatedModule : m)))
      setEditingModuleId(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const toggleModuleExpanded = (moduleId) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId)
  }

  const onChangeNewLesson = (e) => {
    const { name, value } = e.target
    setNewLessonData({
      ...newLessonData,
      [name]:value
    })
  }

  const handleAddLesson = async(moduleId) => {
    if(!newLessonData.name.trim()) return

    setAddingLesson(true)
    setError('')

    try {
      const data = await createLesson(moduleId, newLessonData, token)

      setModules(modules.map((m) => (
        m._id === moduleId ? {...m, lessons: [...m.lessons, data.newLesson]} : m
      )))

      setNewLessonData({
        name:'',
        description:'',
        linkVideo:''
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setAddingLesson(false)
    }
  }

  const startEditLesson = (lesson) => {
    setEditingLessonId(lesson._id)
    setEditingLessonData({
      name: lesson.name,
      description: lesson.description,
      linkVideo: lesson.linkVideo || ''
    })
  }
  const handleDeleteLesson = async(moduleId, lessonId) => {
    setError('')

    try {
      await deleteLesson(lessonId, token)
      setModules(modules.map((m) => (
        m._id === moduleId ? {...m, lessons: m.lessons.filter((l) => l._id !== lessonId)} : m
      )))
    } catch (e) {
      setError(e.message)
    }
  }

  const onChangeEditingLesson = (e) => {
    const { name, value } = e.target
    setEditingLessonData({
      ...editingLessonData,
      [name]:value
    })
  }

  const handleUpdateLesson = async(moduleId) => {
    if(!editingLessonData.name.trim()) return

    setError('')
    try {
      const payload = {...editingLessonData}
      if(!payload.linkVideo.trim()){
        delete payload.linkVideo
      }

      const data = await updateLesson(editingLessonId, payload, token)

      setModules(modules.map((m) => (
        m._id === moduleId ? {...m, lessons: m.lessons.map((l) => (l._id === editingLessonId ? data.updatedLesson : l))} : m
      )))
      
      setEditingLessonId(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setVideoFile(file)
    }
  }

  const handleVideoUpload = async(moduleId, lessonId) => {
    if(!videoFile) return

    setError('')
    setUploadingVideo(true)

    try {
      const data = await uploadLessonVideo(lessonId, videoFile, token)

      setModules(modules.map((m) => (
        m._id === moduleId ? {...m, lessons:m.lessons.map((l) => l._id === lessonId ? data.updatedLesson : l)} : m
      )))

      setVideoFile(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploadingVideo(false)
    }
  }

  if(isLoading){
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-primary-dark mb-6">
          {isEditMode ? 'Modifica corso' : 'Crea nuovo corso'}
        </h1>

        <ErrorAlert message={error} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="name"
            type="text"
            placeholder="Nome del corso"
            value={formData.name}
            onChange={onChangeInput}
            required
            className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3"
          />

          <textarea 
            name="description"
            placeholder="Descrizione"
            value={formData.description}
            onChange={onChangeInput}
            required
            rows={4}
            className="border-2 border-primary/20 rounded-lg bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
          />
          <div className="relative w-fit mb-6 ml-2">
            <select 
              name="category" 
              value={formData.category}
              onChange={onChangeInput}
              required
              className="appearance-none border-2 border-primary/20 rounded-full bg-surface hover:border-primary/40 transition-colors focus:outline-none focus:border-primary pl-4 pr-10 py-3"
            >
              <option value="">Seleziona una categoria</option>
              <option value="Programmazione">Programmazione</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Altro">Altro</option>
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isEditMode && (
            <>
              <div className="border-2 border-primary/20 rounded-lg p-4 flex flex-col items-center gap-3">
                <label htmlFor="courseImage" className="cursor-pointer">
                  <img
                    src={imagePreview || formData.urlImg}
                    alt="Anteprima corso"
                    className="w-48 h-32 object-cover rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors"
                  />
                </label>

                <input 
                  id="courseImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imageFile && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    className="border-2 border-primary/20 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
                  >
                    {uploadingImage ? 'Caricamento...' : 'Carica immagine'}
                  </button>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-bold text-primary-dark mb-4">Moduli</h2>

                <div className="bg-surface rounded-lg shadow divide-y">
                  {modules.map((module) => (
                    <div key={module._id}>
                      <div className="p-4 flex justify-between items-center">
                        {editingModuleId === module._id ? (
                          <div className="flex flex-col gap-2 sm:flex-row flex-1">
                            <input 
                              type="text"
                              value={editingModuleName}
                              onChange={(e) => setEditingModuleName(e.target.value)}
                              className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2 flex-1"
                            />

                            <button
                              type="button"
                              onClick={handleUpdateModule}
                              className="bg-primary text-white px-3 py-2 rounded-full font-semibold text-sm hover:bg-primary-dark"
                            >
                              Salva
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingModuleId(null)}
                              className="border px-3 py-2 rounded-lg text-sm"
                            >
                              Annulla
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(() => toggleModuleExpanded(module._id))}
                              className="flex items-center gap-2 text-primary-dark font-medium flex-1 text-left"
                            >
                              <span className={`transform transition-transform ${expandedModuleId === module._id ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                              {module.name}
                            </button>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEditModule(module)}
                                className="text-sm text-primary hover:underline"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteModule(module._id)}
                                className="text-sm text-red-500 hover:underline"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedModuleId === module._id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                        <div className="px-4 py-4 bg-background">
                          {module.lessons.map((lesson) => (
                            <div 
                              key={lesson._id}
                              className="bg-surface rounded-lg p-3 mb-2"
                            >
                              {editingLessonId === lesson._id ? (
                                <div className="flex flex-col gap-2">
                                  <input 
                                    type="text"
                                    name="name"
                                    placeholder="Nome lezione"
                                    value={editingLessonData.name}
                                    onChange={onChangeEditingLesson}
                                    className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                                  />

                                  <textarea 
                                    name="description"
                                    placeholder="Descrizione"
                                    value={editingLessonData.description}
                                    onChange={onChangeEditingLesson}
                                    rows={2}
                                    className="border-2 border-primary/20 rounded-xl bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                                  />

                                  <input 
                                    type="text"
                                    name="linkVideo"
                                    placeholder="Link video"
                                    value={editingLessonData.linkVideo}
                                    onChange={onChangeEditingLesson}
                                    className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateLesson(module._id)}
                                      className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark"
                                    >
                                      Salva
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingLessonId(null)}
                                      className="border px-3 py-2 rounded-lg text-sm"
                                    >
                                      Annulla
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-primary-dark font-medium">{lesson.name}</p>
                                    <p className="text-sm text-gray-500">{lesson.description}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditLesson(lesson)}
                                      className="text-primary hover:text-primary-dark p-1"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLesson(module._id, lesson._id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 mt-2">
                                <input 
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoChange}
                                  className="text-xs flex-1"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleVideoUpload(module._id, lesson._id)}
                                  disabled={uploadingVideo}
                                  className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-primary-dark disabled:opacity-50"
                                >
                                  {uploadingVideo ? '...' : 'Carica Video'}
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="flex flex-col gap-2 mt-3">
                            <input 
                              type="text"
                              name="name"
                              placeholder="Nome nuova lezione"
                              value={newLessonData.name}
                              onChange={onChangeNewLesson}
                              className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                            />
                            <textarea 
                              name="description"
                              placeholder="Descrizione"
                              value={newLessonData.description}
                              onChange={onChangeNewLesson}
                              rows={2}
                              className="border-2 border-primary/20 rounded-xl bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                            />

                            <input 
                              type="text"
                              name="linkVideo"
                              placeholder="Link video"
                              value={newLessonData.linkVideo}
                              onChange={onChangeNewLesson}
                              className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-3 py-2"
                            />

                            <button
                              type="button"
                              onClick={() => handleAddLesson(module._id)}
                              disabled={addingLesson}
                              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
                            >
                              {addingLesson ? 'Aggiunta...' : 'Aggiungi lezione'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <input 
                  type="text"
                  placeholder="Nome nuovo modulo"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3"
                />

                <button
                  type="button"
                  onClick={handleAddModule}
                  disabled={addingModule}
                  className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-dark disabled:opacity-50"
                >
                  {addingModule ? 'Aggiunta...' : 'Aggiungi modulo'}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : isEditMode ? 'Salva modifiche' : 'Crea corso'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CourseEditor
