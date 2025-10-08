import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Camera, Upload, History, Leaf, Bird, TreePine, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [identificationResult, setIdentificationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  // Fetch app statistics on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  // Real API identification function
  const identifySpecies = async (category) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category })
      })
      
      if (!response.ok) {
        throw new Error('Failed to identify species')
      }
      
      const result = await response.json()
      setIdentificationResult(result)
      setCurrentView('results')
    } catch (err) {
      setError(err.message)
      console.error('Identification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">WildID</h1>
          </div>
          <p className="text-gray-600">Identify wildlife, plants, and fungi with AI</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Identify Species
            </CardTitle>
            <CardDescription>
              Take a photo or upload an image to identify wildlife, plants, or fungi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full h-12" 
              onClick={() => setCurrentView('camera')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Camera className="h-5 w-5 mr-2" />
              )}
              Take Photo
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => setCurrentView('upload')}
              disabled={isLoading}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Recent Identifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <Bird className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">American Robin</span>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <Leaf className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">Common Dandelion</span>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <Bird className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Birds</p>
            <p className="text-xs text-gray-500">
              {stats?.categories?.birds || '400+'} species
            </p>
          </Card>
          <Card className="text-center p-4">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Plants</p>
            <p className="text-xs text-gray-500">
              {stats?.categories?.plants || '1000+'} species
            </p>
          </Card>
          <Card className="text-center p-4">
            <TreePine className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium">Fungi</p>
            <p className="text-xs text-gray-500">
              {stats?.categories?.fungi || '100+'} species
            </p>
          </Card>
        </div>

        {stats && (
          <Card className="mt-4">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-600">
                Total species in database: <span className="font-bold">{stats.total_species}</span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  const CameraScreen = () => (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
          <Camera className="h-16 w-16 mx-auto mb-4 text-white" />
          <p className="text-white mb-4">Camera viewfinder would appear here</p>
          <p className="text-gray-400 text-sm">In a real app, this would show the camera feed</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => identifySpecies('birds')}
              disabled={isLoading}
            >
              <Bird className="h-6 w-6" />
            </Button>
            <Button 
              className="h-16 bg-white text-black hover:bg-gray-100"
              onClick={() => identifySpecies('plants')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'Capture'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => identifySpecies('fungi')}
              disabled={isLoading}
            >
              <TreePine className="h-6 w-6" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-white"
            onClick={() => setCurrentView('home')}
            disabled={isLoading}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )

  const UploadScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Select an image from your device to identify
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Drag and drop an image here</p>
              <Button onClick={() => identifySpecies('plants')} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Choose File'
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Try these examples:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => identifySpecies('birds')}
                  disabled={isLoading}
                >
                  Bird
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => identifySpecies('plants')}
                  disabled={isLoading}
                >
                  Plant
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => identifySpecies('fungi')}
                  disabled={isLoading}
                >
                  Fungi
                </Button>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setCurrentView('home')}
              disabled={isLoading}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ResultsScreen = () => {
    if (!identificationResult) return null

    const getEdibilityIcon = (edibility) => {
      if (edibility.toLowerCase().includes('poisonous') || edibility.toLowerCase().includes('toxic')) {
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      } else if (edibility.toLowerCase().includes('edible')) {
        return <CheckCircle className="h-5 w-5 text-green-500" />
      }
      return <Info className="h-5 w-5 text-blue-500" />
    }

    const getEdibilityColor = (edibility) => {
      if (edibility.toLowerCase().includes('poisonous') || edibility.toLowerCase().includes('toxic')) {
        return 'bg-red-100 text-red-800'
      } else if (edibility.toLowerCase().includes('edible')) {
        return 'bg-green-100 text-green-800'
      }
      return 'bg-blue-100 text-blue-800'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Identification Result</span>
                <Badge variant="secondary">{identificationResult.confidence}% confident</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{identificationResult.common_name}</h3>
                <p className="text-gray-600 italic">{identificationResult.species}</p>
                <Badge className="mt-2">{identificationResult.category}</Badge>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm">{identificationResult.description}</p>
              </div>
              
              {identificationResult.habitat && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Habitat:</strong> {identificationResult.habitat}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  {getEdibilityIcon(identificationResult.edibility)}
                  <div className="flex-1">
                    <p className="font-medium">Edibility</p>
                    <Badge className={getEdibilityColor(identificationResult.edibility)}>
                      {identificationResult.edibility}
                    </Badge>
                  </div>
                </div>
                
                {identificationResult.herbal_benefits !== 'Not applicable' && (
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Herbal Benefits</p>
                      <p className="text-sm text-gray-600">{identificationResult.herbal_benefits}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1"
                  onClick={() => setCurrentView('home')}
                >
                  Identify Another
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert('Saved to history!')}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {identificationResult.warning && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">Warning: This species is toxic</p>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  {identificationResult.warning}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'camera':
        return <CameraScreen />
      case 'upload':
        return <UploadScreen />
      case 'results':
        return <ResultsScreen />
      default:
        return <HomeScreen />
    }
  }

  return renderCurrentView()
}

export default App
