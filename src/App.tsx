import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { Contacts } from './views/Contacts';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Contacts />
    </QueryClientProvider>
  );
}



export default App;
