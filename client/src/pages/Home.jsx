import React, { useState, useEffect } from 'react'

import { DisplayProjects, Pagination, Loader } from '../components';
import { useStateContext} from '../context';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [projectList, setProjectList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [sortBy, setSortBy] = useState({
        popular: false,
        recent: false,
        onlyCharity: false,
        onlyStartup: false
    })

    const maxObjectPerPage = 12;

    const { getProjectList } = useStateContext()

    const fetchProjectList = async (sortBy) => {
        setIsLoading(true);

        const [list, count] = await getProjectList(sortBy);
        setProjectCount(parseInt(count));
        const trimedList = list.slice(0, maxObjectPerPage);
        setProjectList(trimedList);

        setIsLoading(false);
    }

    useEffect(() => {
        const skip = (currentPage) * maxObjectPerPage;
        fetchProjectList({skip, ...sortBy});
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(0)
        fetchProjectList({skip: 0, ...sortBy})
    }, [sortBy])

  return (
    <>
        {isLoading && <Loader/>}
        <DisplayProjects
            title = {"All Projects"} 
            total = {projectCount}
            isLoading = {isLoading}
            projectList = {projectList}
            sortBy = {sortBy}
            setSortBy = {setSortBy}
            emptyMessage = {'No Projects found'}
            clickURL = 'project-details'
        />
        <Pagination
        total={projectCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        objectPerPage={maxObjectPerPage}
        />
    </>
    
  )
}

export default Home