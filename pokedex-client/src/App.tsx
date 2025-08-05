import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from '@/pages/PokemonList';
import PokemonDetails from '@/pages/PokemonDetails';
import AddPokemon from '@/pages/AddPokemon';
import EditPokemon from '@/pages/EditPokemon';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/add" element={<AddPokemon />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
        <Route path="/pokemon/:id/edit" element={<EditPokemon />} />
      </Routes>
    </Router>
  );
}

export default App;
