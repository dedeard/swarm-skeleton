import { IMCPHubToolRecommendation } from '@/types/agent'
import { Button, Card, CardBody, CardHeader } from '@heroui/react' // Added Divider
import { Brain, ExternalLink, Info } from 'lucide-react' // Added Info and ExternalLink icons
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface MCPHubRecommendationsProps {
  recommendations: IMCPHubToolRecommendation[]
}

const MCPHubRecommendations: React.FC<MCPHubRecommendationsProps> = ({ recommendations }) => {
  const hasRecommendations = recommendations && recommendations.length > 0

  return (
    <Card shadow="sm" className="mt-6 border border-divider bg-background">
      {/* CardHeader component from HeroUI [cite: heroui-inc/heroui/heroui-d40c744f46f14c2212bd4c9ba116bb866c368426/packages/components/card/src/card-header.tsx] */}
      <CardHeader className="border-b border-divider p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Brain size={20} className="text-secondary" /> MCPHub Recommendations
        </h3>
      </CardHeader>
      {/* CardBody component from HeroUI [cite: heroui-inc/heroui/heroui-d40c744f46f14c2212bd4c9ba116bb866c368426/packages/components/card/src/card-body.tsx] */}
      <CardBody className={`max-h-72 ${hasRecommendations ? 'p-0' : 'p-4'}`}>
        {hasRecommendations ? (
          <PerfectScrollbar className="h-full w-full" options={{ suppressScrollX: true, wheelPropagation: false }}>
            <div className="space-y-3 p-3">
              {recommendations.map((rec, index) => (
                <Card
                  key={index}
                  shadow="none" // Use a flatter style for inner cards or a very subtle shadow
                  isHoverable
                  className="border border-divider bg-content1 transition-background hover:bg-content2"
                >
                  <CardBody className="p-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-md font-semibold text-primary-600 dark:text-primary-400">{rec.name}</h4>
                      <p className="line-clamp-3 text-sm text-foreground-600 dark:text-foreground-400">{rec.description}</p>
                      {rec.url && (
                        // Button component from HeroUI [cite: heroui-inc/heroui/heroui-d40c744f46f14c2212bd4c9ba116bb866c368426/packages/components/button/src/button.tsx]
                        <Button
                          as="a"
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer" // Important for security with target="_blank"
                          size="sm"
                          variant="flat" // Changed from light for a bit more presence
                          color="primary"
                          className="mt-2 self-start" // Aligns button to the start
                          endContent={<ExternalLink size={14} />} // Added icon
                        >
                          Learn more
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </PerfectScrollbar>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-6 text-center">
            <Info size={40} className="mb-3 text-foreground-400" />
            <p className="text-md font-medium text-foreground-500">No specific recommendations found.</p>
            <p className="text-xs text-foreground-400">(Try adjusting your input or criteria)</p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default MCPHubRecommendations
