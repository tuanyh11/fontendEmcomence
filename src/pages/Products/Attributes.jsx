import React, { useState, useEffect } from 'react';
import Form from '../../components/Form/Form';
import Table from '../../components/Table/Table';
import CombineAtt from '../../components/CombineAtt/CombineAtt';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Attributes = () => {
    const adMidId = localStorage.getItem('name');
    const id = useParams();
    const navigate = useNavigate();
    const initData = {
        productId: id.productId,
        name: '',
        values: []
    }

    const [isSubmit, setIsSubmit] = useState(false);

    const [attData, setAttData] = useState(initData);

    const [attValue, setAttValue] = useState([]);

    const [inputAttValues, setInputAttValues] = useState([]);

    const [formData, setFormData] = useState([]);
    

    // const [combineData, setCombineData] = useState([]),

    const setValueForm = (e) => {
        const {value, name} = e.target;
        setAttData({...attData, [name]: value})
    }

    const renderInput = (item, index) => (
        <div className="group" key={index}>
            <span>{item.titleInput}</span> 
            <input type="text" name={item.name} value={item.value} placeholder={item.placeholder} onChange={setValueForm}/>
        </div>
    );

    // get Product Id 
    const [productId, setProductId] = useState();

    const getProductId = async() => {
        try {
            const result = await axios.get(`http://localhost:5000/api/product/${id.productId}`);
            if(result.status === 200) {
                setProductId(result.data.id);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProductId();
        if((productId === id.productId)) {
            navigate('/createproduct')
        }
    }, [id.productId])

    const inputs = [
        {
            titleInput: 'name',
            name: 'name',
            placeholder: 'type in here',
            value: attData.name
        }
    ]

    const setInputFormValue = (e, index) => {
        const data = inputAttValues.map((item, id) => {
            if(id === index) {
                attData.values[id] = e.target.value;
                return attData.values[id];
            }
            return attData.values[id];
        })

        setAttData({...attData, [e.target.name]: [...data]})
    }

    const renderInputAtt = ( item ,index) => (
        <div className="group" key={index}>
            <span>attribute value</span>
            <input type="text" name='values' placeholder='type in here' value={attData.values[index] ? attData.values[index]: ''} onChange={(e) => setInputFormValue(e, index)}/>
        </div>
    )
    
    const createAttributes = () => {
        setAttValue([...attValue, attData]);
        setAttData(initData);
        setInputAttValues([]);
    }

    const renderButtonSubmit = () => (<button type="button" onClick={() => createAttributes()}>create</button>);

    const handleIncInput = () => {
        setInputAttValues([...inputAttValues, 0]);
    }

    const renderButton = () => (<button type="button" onClick={handleIncInput}>add attribute value</button>)

    const attributeHead = [
        'name',
        'terms'
    ]

    const renderHead = (item, index) => (<th key={index}>{item}</th>)

    // 

    const renderBody = (item, index) => (
        <tr key={index}>
            <td><Link to={`/attributes/${index}`}>{item.name}</Link></td>
            <td>{item.values.map((item, id) => id == 0 ? `${item}`: `-${item}`)}</td>
        </tr>
    )


    const hanleSubmit = async(e) => {
        e.preventDefault()
        // createItem();
    }

    const [combineData, setCombineData] = useState([])

    const getItems = async() => {
        try {
            const result = await axios.get(`http://localhost:5000/api/attribute/${id.productId}`);
            setAttValue([...result.data]);
         } catch (error) {
             console.log(error);
         }
    }

    useEffect(() => {
        getItems();
    },[isSubmit])


  return (
    <div className="attributePage">
        {
             true ? (
              <>
                  <h2 className="pageHeader">
                    Attributes
                </h2>
                <div className="row">
                    <div className="col-6">
                        <div className="card">
                            <h3 className="title">
                                Add new Attributes
                            </h3>
                            <p className='discription'>
                            thuộc tính là một đặc tả định nghĩa đặc tính của một đối tượng, phần tử, hay tập tin. Nó còn có thể chỉ đến giá trị cho một thực thể cụ thể
                            </p>
                            <Form
                                dataForm={inputs}
                                renderInput={(item, index) => renderInput(item, index)}
                                hanleSubmit={hanleSubmit}
                                renderButtonSubmit={inputAttValues.length > 0 && attData.name? () => renderButtonSubmit(): ''}
                                renderButton={() => renderButton()}
                                inputAttValues={inputAttValues}
                                renderInputAtt={(item, index) => renderInputAtt(item, index)}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <Table
                                headData={attributeHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={attValue}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                        <CombineAtt
                                attValue={attValue}
                                id={id.productId ? id.productId : ''}
                        />
                        </div>
                    </div>
                </div>
              </>
            ): ''
        }
    </div>
  )
}

export default Attributes