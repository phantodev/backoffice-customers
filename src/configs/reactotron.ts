import Reactotron from 'reactotron-react-js'
import reactotronZustand from 'reactotron-plugin-zustand'
import { useCustomerStore } from '@/stores/customerStore'

if (typeof window !== 'undefined') {
  Reactotron.configure({ name: 'App Customers' })
    .use(
      reactotronZustand({
        stores: [{ name: 'customerStore', store: useCustomerStore }],
      }),
    )
    .connect()
}

console.tron = Reactotron
