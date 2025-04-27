'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="p-6 bg-zinc-900/50 backdrop-blur-sm border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-500">Произошла ошибка</h3>
              <p className="text-sm text-gray-400 mt-1">
                {this.state.error?.message || 'Что-то пошло не так'}
              </p>
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={this.handleReset}
              >
                <RefreshCcw className="w-4 h-4" />
                Попробовать снова
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
} 