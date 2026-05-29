import { useEffect, useState } from 'react'

import Input from '../Form/input'
import Select from '../Form/Select'
import SubmitButton from '../Form/SubmitButton'
import styles from './ProjectForm.module.css'
import { data } from 'react-router-dom'

function ProjectForm({ btnText }) {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                "Content-Type": "aplication/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data)
            })
            .catch((err) => console.log(err))
    }, [])



    return (
        <form className={styles.form}>
            <Input type="text" text="Nome do projeto" name="Nome" placeholder="Insira o nome do projeto" />
            <Input type="number" text="Orçamento do projeto" name="Budget" placeholder="Insira o orçamento total" />
            <Select name="category_id" text="Selecione a categoria" options={categories} />
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ProjectForm