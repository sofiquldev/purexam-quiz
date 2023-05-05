"use client"

import React, { useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

import styles from './MCQ.module.scss'
import logo from './logo.svg'

import { Hind_Siliguri } from 'next/font/google'
const hindSiliguri = Hind_Siliguri({subsets: ['bengali', 'latin', 'latin-ext'], weight: ['300', '400', '500', '600', '700']})

const MCQ = () => {
    const componentRef = useRef();
    const [questionData, setQuestionData] = useState({
        id: 1,
        question: 'নিচের কোন দেশটি ডি-৮ এর সদস্য নয়?',
        options: [
            {title: 'জর্ডান', isCorrect: false},
            {title: 'ইরান', isCorrect: false},
            {title: 'মিশর', isCorrect: true},
            {title: 'মালয়েশিয়া', isCorrect: false}
        ],
        ref: [1],
        explain: '',
        meta: {
            subjectId: 1,
            authorId: 1,
            createdAt: '09:00 pm',
        }
    })
    const [openPopup, setOpenPopup] = useState(true)
    
    const optionsKey = {
        bn: ['ক', 'খ', 'গ', 'ঘ'],
        en: ['a', 'b', 'c', 'd'],
        num: [1,2,3,4],
        roman: ['i', 'ii', 'iii', 'iv']
    }

    const handleDownload = async () => {
        // const node = componentRef.current;
        const node = document.getElementById('question');
        const { width } = node.getBoundingClientRect();
        const contentNode = node;
        const dataUrl = await domtoimage.toJpeg(contentNode, {
        width: width,
        height: contentNode.offsetHeight,
        style: {
            transform: `translate(-${contentNode.offsetLeft}px, ${contentNode.offsetTop}px)`,
        },
        });
        saveAs(dataUrl, `purexam-quiz-${questionData.id}.jpeg`);
    };

    const popupHandler = () => setOpenPopup(true)

    const formSubmitHandler = e => {
        e.preventDefault()
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        setQuestionData({...questionData, question: formDataObject.title,
        options: [
            {title: formDataObject.option_a, isCorrect: false},
            {title: formDataObject.option_b, isCorrect: false},
            {title: formDataObject.option_c, isCorrect: true},
            {title: formDataObject.option_d, isCorrect: false}
        ],})
        setOpenPopup(false)
    }
    return(
        <>
            <div className={styles.wrapper} ref={componentRef} id='question' >
                <div className={styles.header}>
                    Daily&nbsp;<strong>MCQ</strong>
                    <span className={styles.header__id}>
                        Q00{questionData.id}
                    </span>
                </div>
                
                <h1 className={styles.question}>
                    {questionData.question}
                </h1>

                <ul className={styles.options}>
                    {questionData.options.map((option,i) => (
                        <li className={styles.options__item} key={i}>
                            <span className={styles.options__key}>{optionsKey.bn[i]}</span>
                            <span className={styles.options__title}>
                                {option.title}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className={styles.footer}>
                    <img className={styles.footer__logo} src={logo.src} alt="logo" />
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.actions__btn} onClick={popupHandler}>Update</button>
                <button className={styles.actions__btn} onClick={handleDownload}>Download</button>
            </div>

            {
                openPopup ? <div className={styles.popup}>
                    <div className={styles.popup__inner}>
                        <h2 className={styles.popup__title}>{`Update #Q00${questionData.id}`}</h2>
                        <form onSubmit={formSubmitHandler}>
                            <Input
                                name='title'
                                label='Question Title'
                                type='text'
                                value={questionData.question}
                            />
                            {
                                ['a','b','c','d'].map((item, index) => (
                                    <Input
                                        name={`option_${item}`}
                                        label={`option ${item}`}
                                        type='text'
                                        inputType='option'
                                        value={questionData.options[index].title}
                                        correct={questionData.options[index].isCorrect}
                                        key={index}
                                    />
                                ))
                            }
                            <button className={styles.popup__save} type='submit'>Save Question</button>
                        </form>
                    </div>
                </div> : null
            }
        </>
    )
}


const Input = props => {
    const [input, setInput] = useState(props.value)
    const [focus, setFocus] = useState(false)
    const [correct, setCorrect] = useState(false)

    const onChangeHandler = e => {
        e.preventDefault()
        setInput(e.target.value)
    }

    const onfocusHandler = () => setFocus(true)
    const onblurHandler = () => setFocus(false)
    const checkClickHandler = () => setCorrect(!correct)

    return (
        <div className={styles.inputGroup}>
            {
                props.inputType == 'option' ? <>
                    <input id={`${props.name}_check`} type='checkbox' className={styles.inputGroup__option__input} value={correct ? 'checked': '' } />
                    <label htmlFor={`${props.name}_check`} className={styles.inputGroup__option__label} style={{backgroundColor: correct ? '#00CB72': 'transparent'}} onClick={checkClickHandler}></label>
                </> : null
            }
            <div className={`${styles.inputGroup__inner} ${ !focus && !input ? styles.inputGroup__focus: '' }`}>
                <label className={styles.inputGroup__label} htmlFor={props.name}>{props.label}</label>
                <input 
                    style={hindSiliguri.style}
                    className={styles.inputGroup__input} 
                    id={props.name} 
                    name={props.name}
                    type={props.type} 
                    value={input} 
                    onChange={onChangeHandler}
                    onFocus={onfocusHandler}
                    onBlur={onblurHandler}
                />
            </div>
        </div>
    )
}


export default MCQ