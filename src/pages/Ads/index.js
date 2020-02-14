import React, { useState, useEffect } from 'react';
import { PageArea } from './styled';

import { PageContainer } from '../../components/MainComponents';
import useAPI from '../../helpers/OlxAPI';
import { useLocation, useHistory } from 'react-router-dom';
import AdItem from '../../components/partials/AdItem';

let timer;
const Page = () => {
     
    const  api = useAPI();
    const history = useHistory();
    //alert(useLocation().search);
    const useQueryString = () => {
        return new URLSearchParams( useLocation().search );
    }
    const query = useQueryString();

    const [q, setQ]  = useState(query.get('q') != null ? query.get('q') : '');
    const [cat, setCat]  = useState(query.get('cat') != null ? query.get('cat') : '');
    const [state , setState]  = useState(query.get('state') != null ? query.get('state') : '');

    const [stateList , setStateList]  = useState([]);
    const [categories, setCategories] = useState([]);
    const [adList, setAdList]         = useState([]); 
    const [resultOpacity, setResultOpacity] = useState(1);
    const [loading, setLoading] = useState(true);

    const [pageCount, setPageCount] = useState(0);
    const [adsTotal, setAdsTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const getAdsList = async () => {
        setLoading(true);
        let offset = (currentPage -1) * 2;
        const json = await api.getAds({
            sort: 'desc',
            limit: 9,
            q,
            cat,
            state,
            offset
        });
        setAdList(json.ads);
        setResultOpacity(1);
        setLoading(false);
        setAdsTotal(json.total);
    }
    useEffect(() => {
        if(adList.length > 0){
            setPageCount( Math.ceil( adsTotal / adList.length));
        }else {
            setPageCount( 0 );
        }

    }, [adsTotal]);
    useEffect(() => {
        setResultOpacity(0.3);
        getAdsList();
    }, [currentPage]);

    useEffect(()=> {
        let queryString = [];
        if(q) {
            queryString.push(`q=${q}`);
        }
        if(cat) {
            queryString.push(`cat=${cat}`);
        }
        if(state) {
            queryString.push(`state=${state}`);
        }
        history.replace({
            search: `?${queryString.join('&')}`
        });
        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(getAdsList, 2000);
        setResultOpacity(0.3);
        setCurrentPage(1);
        //getAdsList();

    }, [q, cat, state])
    useEffect(()=> {
        const getStates = async () => {
            const slist = await api.getStates();
            setStateList(slist);
        }
        getStates();
    }, []);
    useEffect(()=> {
        const getCategories = async () => {
            const cats = await api.getCategories();
            setCategories(cats);
        }
        getCategories();
    }, []);
  
    let pagination = [];
    for (let i = 1; i <= pageCount; i++) {
            pagination.push(i);
        
    }    
    return (
      
        <PageContainer>
            <PageArea>
                <div className="leftSide">
                    <form method="GET">
                        <input 
                            type="text" 
                            name="q" 
                            value={q} 
                            placeholder="O que você procura?"
                            onChange={e=>setQ(e.target.value)}
                            />

                        <div className="filterName">Estado: </div>
                        <select name="state" value={state} onChange={e=>setState(e.target.value)}>
                            <option></option>
                            {stateList.map((i, k) => 
                                <option key={k} value={i.name}>{i.name}</option>
                            )}
                        </select>

                        <div className="filterName">Categoria: </div>
                        <ul>
                            {categories.map((i, k)=>
                              <li key={k} className={cat==i.slug ? 'categoryItem active' : 'categoryItem' }
                              onClick={e=>setCat(i.slug)}>
                                  <img src={i.img} alt=""/>
                                  <span>{i.name}</span>
                              </li>       
                            )}
                        </ul>
                    </form>
                </div>
                <div className="rightSide">
                    <h2>Resultados</h2>
                     {loading && adList === 0 &&
                        <div className="listWarning">Pesquisando...</div>
                     }
                     {!loading && adList.length === 0 && 
                        <div className="listWarning">Não encontramos resultados.</div>
                     }           
                    <div className="list" style={{opacity: resultOpacity}}>
                        {adList.map((i, k)=>
                            <AdItem key={k} data={i}/>
                        )}
                    </div>
                    <div className="pagination">
                        {pagination.map((i, k) => 
                            <div onClick={()=> setCurrentPage(i)} className={i===currentPage ? 'pageItem active': 'pageItem'}>{i}</div>
                        )}    

                    </div>
                </div>
            </PageArea>

        </PageContainer>

    );
}
export default Page;