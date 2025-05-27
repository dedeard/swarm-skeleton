import { IMCPHubToolRecommendation } from '@/types/agent'
import { Button, Card, CardBody, CardHeader } from '@heroui/react'
import { Brain } from 'lucide-react'
import React from 'react'

interface MCPHubRecommendationsProps {
  recommendations: IMCPHubToolRecommendation[]
}

const MCPHubRecommendations: React.FC<MCPHubRecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Brain /> MCPHub Recommendations
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-foreground-500">No specific recommendations found based on current input.</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Brain /> MCPHub Recommendations
        </h3>
      </CardHeader>
      <CardBody>
        <div className="max-h-60 space-y-3 overflow-y-auto">
          {recommendations.map((rec, index) => (
            <Card key={index} shadow="sm" className="bg-content2">
              <CardBody>
                <h4 className="font-semibold">{rec.name}</h4>
                <p className="text-sm text-foreground-600">{rec.description}</p>
                {rec.url && (
                  <Button as="a" href={rec.url} target="_blank" size="sm" variant="light" color="primary" className="mt-1 px-0">
                    Learn more
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default MCPHubRecommendations
