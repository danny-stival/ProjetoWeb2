// src/App.tsx
import UsuarioList from "./components/Usuario/UsuarioList.tsx";
import PermissaoList from "./components/Permissao/PermissaoList.tsx";
import LivroList from "./components/Livro/LivroList.tsx";

function App() {
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Usuários cadastrados</h1>
            <UsuarioList />

            <h1>Permissões</h1>
            <PermissaoList />

            <h1>Livros</h1>
            <LivroList />
        </div>
    );
}

export default App;