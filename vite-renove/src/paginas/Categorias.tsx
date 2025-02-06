import { useEffect, useState } from "react";
import CaixaDeTexto from "../componentes/CaixaDeTexto";
import Botao from "../componentes/Botao";

const Categorias = () => {

    const [lista, setResposta] = useState([]);
    const [formulario, setFormulario] = useState({ id: '', nome: "" });

    useEffect(() => {
        console.log("dados capturados");
        fetch('http://localhost:8080/categorias')
            .then(res => res.json())
            .then(res => setResposta(res));
    }, []);

    const listaDinamica = lista.map(item =>
        <li key={item["id"]} id="item-lista" className="fonte-inter" onClick={() => { coletarDados(item["id"]) }}>
            {item["nome"]}
        </li>
    )

    function coletarDados(id = 0) {
        const categoria = lista.filter(item => item["id"] == id)[0];
        const dados = { id: categoria["id"], nome: categoria["nome"] }
        setFormulario(dados);
    }

    function enviarRequisicao(metodo: string) {
        type requisicao = {
            id?: number | '',
            nome: string
        }

        const corpo: requisicao = {
            id: (metodo == "PUT" || metodo == "DELETE") ? Number((document.getElementById("id") as HTMLInputElement).value) : '',
            nome: (document.getElementById("nome") as HTMLInputElement).value,
        }

        if (metodo == "PUT " || metodo == "DELETE")
            if (corpo["id"] == '')
                return;

        console.log(corpo);

        if (metodo == "POST" || metodo == "PUT") {
            fetch('http://localhost:8080/categorias/' + corpo["id"], {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            })
                .then(res => console.log(res));
        } else if (metodo == "DELETE") {
            fetch('http://localhost:8080/categorias/' + corpo["id"], {
                method: metodo,
            })
                .then(res => console.log(res));
        }
    }

    return (
        <>
            <div id="caixa-flex">
                <ul id="scrollavel">
                    {listaDinamica}
                </ul>
                <div id="formulario">
                    <form>
                        <CaixaDeTexto id="id" tipo="hidden" valor={String(formulario["id"])}></CaixaDeTexto>
                        <CaixaDeTexto id="nome" tipo="text" valor={String(formulario["nome"])}>Nome da categoria: </CaixaDeTexto>
                        <div style={{ display: "flex" }}>
                            <Botao clique={() => enviarRequisicao("POST")}>Cadastrar nova categoria</Botao>
                            <Botao clique={() => enviarRequisicao("PUT")}>Atualizar categoria</Botao>
                            <Botao clique={() => enviarRequisicao("DELETE")}>Deletar categoria</Botao>
                        </div>
                    </form>
                </div>
            </div>
            <div id="detalhes" className="fonte-inter">
                {lista.length} categorias encontrados
            </div>
        </>
    );
}

export default Categorias;