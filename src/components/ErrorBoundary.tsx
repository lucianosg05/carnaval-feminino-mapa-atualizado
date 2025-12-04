import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean; error?: any }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl bg-red-50 border border-red-200 rounded-md p-6">
            <h2 className="text-lg font-bold text-red-800 mb-2">Ocorreu um erro nesta página</h2>
            <p className="text-red-700">Tente recarregar a página. Se o problema persistir, contate o suporte.</p>
            <pre className="mt-4 text-xs text-red-600">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
