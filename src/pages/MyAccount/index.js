import React, { useState, useEffect } from 'react';
import { PageArea } from './styled';
import Cookies from 'js-cookie';

import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import { doLogin } from '../../helpers/AuthHandler';

const Page = () => {
     
    const api = useAPI();
    let token = Cookies.get('token');
    console.log(token);
    const json = {};

    const [name, setName] = useState('');
    const [stateLoc, setStateLoc] = useState('');
    // informacao do usuario
    const [user, setUser] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [rememberPass, setRememberPass] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    useEffect( ()=> {
        
        const getUser = async () => {
            //pegar o usuario cadastrado
            json = await api.getUser();
            setUser(json);
            console.log(json.name);
        }
        getUser();
        console.log(json.name);
        
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setDisabled(true);
        setError('');

        if(password !== confirmPass){
            setError('Senhas diferentes!');
            setDisabled(false);
            return; // pára a execução;
        }
        
        const json = await api.register(name, email, password, stateLoc);

        if(json.error) {
            setError(json.error);
        }else{
            doLogin(json.token);
            window.location.href = "/";
        }
        
        setDisabled(false);
    }

    return (
        <PageContainer>
            <PageTitle>Minha Conta</PageTitle>
            <PageArea>
                {error && 
                    <ErrorMessage>{error}</ErrorMessage>
                }
                <form onSubmit={handleSubmit}>
                <label className="area">
                        <div className="area--title">Nome Completo</div>
                        <div className="area--input">
                            <input type="text" 
                            disabled={disabled}
                            value={name}
                            onChange={e=>setName(e.target.value)}
                            required    
                            ></input>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title">Estado</div>
                        <div className="area--input">
                            <select value={stateLoc} onChange={(e)=> setStateLoc(e.target.value)} required>
                                <option></option>
                                
                            </select>  
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title">E-mail</div>
                        <div className="area--input">
                            <input type="email" 
                            disabled={disabled}
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                            required    
                            ></input>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title">Senha</div>
                        <div className="area--input">
                            <input type="password" 
                            disabled={disabled}
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                            required
                            ></input>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title">Confirmar senha</div>
                        <div className="area--input">
                            <input type="password" 
                            disabled={disabled}
                            value={confirmPass}
                            onChange={e=>setConfirmPass(e.target.value)}
                            required
                            ></input>
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title"></div>
                        <div className="area--input">
                            <button disabled={disabled}>Fazer Cadastro</button>
                        </div>
                    </label>
                </form>
            </PageArea>

        </PageContainer>



    );
}
export default Page;