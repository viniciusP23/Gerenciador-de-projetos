import { useEffect, useState } from 'react'

import Input from '../Form/input'
import Select from '../Form/Select'
import SubmitButton from '../Form/SubmitButton'
import styles from './ProjectForm.module.css'
import { data } from 'react-router-dom'

function ProjectForm({ handleSubimit, btnText, projectData }) {

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || [])

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data)
            })
            .catch((err) => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubimit(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        setProject({ ...project,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            },
        })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome do projeto" name="Nome" handleOnChange={handleChange} placeholder="Insira o nome do projeto" />
            <Input type="number" text="Orçamento do projeto" name="Budget" handleOnChange={handleChange} placeholder="Insira o orçamento total" />
            <Select name="category_id" text="Selecione a categoria" handleOnChange={handleCategory} options={categories} value={project.category ? project.category.id : ""}/>
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ProjectForm