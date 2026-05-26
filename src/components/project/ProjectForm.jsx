import Input from '../Form/input'
import Select from '../Form/Select'
import SubmitButton from '../Form/SubmitButton'
import styles from './ProjectForm.module.css'

function ProjectForm({btnText}) {

    return (
        <form className={styles.form}>
            <Input type="text" text="Nome do projeto" name="Nome" placeholder="Insira o nome do projeto" />
            <Input type="number" text="Orçamento do projeto" name="Budget" placeholder="Insira o orçamento total" />
            <Select name="category_id" text="Selecione a categoria"/>
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ProjectForm