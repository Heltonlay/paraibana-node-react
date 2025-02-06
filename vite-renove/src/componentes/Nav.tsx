const Nav = ({ classe = 'barra-navegacao' }) => {
    return (
        <>
            <nav className={classe + " fonte-inter"}>
                <a href="/">Página inicial</a>
                <a href="/funcionarios">Funcionários</a>
                <a href="/vendas">Vendas</a>
                <a href="/roupas">Produtos</a>
                <a href="/categorias">Categorias</a>
            </nav>
        </>
    )
}

export default Nav;