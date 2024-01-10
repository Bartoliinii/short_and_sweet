import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { setupStore } from './app/store'

const store = setupStore()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
		<App />
	</Provider>
)