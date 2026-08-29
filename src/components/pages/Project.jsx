import styles from "./Project.module.css"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Loading from "../layout/Loading"
import Container from "../layout/Container"
import ProjectForm from "../project/ProjectForm"
import ServiceForm from "../services/ServiceForm"
import Message from "../layout/Message"
import ServiceCard from "../services/ServiceCard"

import { v4 as uuidv4, parse } from "uuid";

function Project() {

    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMassage] = useState()
    const [type, setType] = useState()
    

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                    setServices(data.services)
                })
                .catch((err) => console.log(err))
        }, 1000)

    }, [id])

    function editPost(project) {
        setMassage("")

        if (project.budget < project.cost) {
            setMassage("O orçamento não pode ser menor que o custo do projeto!")
            setType("error")
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project)
        })
            .then(resp => resp.json())
            .then((data) => {

                setProject(data)
                setShowProjectForm(false)
                setMassage("Projeto atualizado!")
                setType("success")
            })
            .catch(err => console.log(err))
    }

    function createService(project) {
        setMassage("")

        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)) {
            setMassage("Orçamento ultrapassado, verifique o valor do serviço")
            setType("error")
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((res) => res.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))

    }

    function removeService(id, cost) {

    const servicesUpdate = project.services.filter(
        (service) => service.id !== id
    )

    const projectUpdate = {
        ...project,
        services: servicesUpdate,
        cost: parseFloat(project.cost) - parseFloat(cost)
    }

    fetch(`http://localhost:5000/projects/${projectUpdate.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectUpdate)
    })
        .then((res) => res.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)

            setMassage("Serviço removido com sucesso!")
            setType("success")
        })
        .catch((err) => console.log(err))
}

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

     function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (<>{project.Nome ?
        <div className={styles.project_details}>
            <Container customClass="column">
                {message && <Message type={type} msg={message} />}
                <div className={styles.details_container}>
                    <h1>Projeto: {project.Nome}</h1>
                    <button className={styles.btn} onClick={toggleProjectForm}>
                        {!showProjectForm ? "Editar projeto" : "Fechar"}
                    </button>
                    {!showProjectForm ? (
                        <div className={styles.project_info}>
                            <p>
                                <span>Categoria:</span> {project.category.name}
                            </p>

                            <p>
                                <span>Total de Orçamento:</span> {project.budget}
                            </p>

                            <p>
                                <span>Total Utilizado:</span> {project.cost}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.project_info}>
                            <ProjectForm handleSubimit={editPost} btnText="Concluir edição" projectData={project} />
                        </div>
                    )}
                </div>
                <div className={styles.service_form_container}>
                    <h2>Adicione um serviço:</h2>
                    <button className={styles.btn} onClick={toggleServiceForm}>
                        {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                    </button>
                    <div className={styles.project_info}>
                        {showServiceForm && (
                            <ServiceForm 
                            handlesubmit={createService}
                            btnText="Adicionar serviço"
                            projectData={project}
                            />
                        )}
                    </div>
                </div>
                <h2>Serviços</h2>
                <Container customClass="start">
                    {services.length > 0 &&
                        services.map((service) => (
                            <ServiceCard
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                handleRemove={removeService}
                            />
                        ))
                    }
                    {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                </Container>
            </Container>
        </div>
        : <Loading />
    }

    </>)



}

export default Project