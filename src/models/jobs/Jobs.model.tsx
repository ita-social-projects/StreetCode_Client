interface JobShort {
    id: number,
    title: string,
    salary: string,
    status: boolean
}

interface Job extends JobShort {
    description: string
}
