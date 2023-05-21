import React from 'react';

import FundCard from './FundCard';
import { loader } from '../assets';
import { useNavigate } from 'react-router-dom';

const DisplayProjects = ({ title, total, isLoading, projectList, sortBy, setSortBy, emptyMessage = 'You have not created any project yet', clickURL, WhiteTheme } ) => { 
  const navigate = useNavigate()

  const handleSetSortBy = (fieldName, value) => {
    if(fieldName == 'recent'){
      return setSortBy({...sortBy, ['recent']: !sortBy.recent, ['popular']: false})
    }

    if(fieldName == 'popular'){
      return setSortBy({...sortBy, ['popular']: !sortBy.popular, ['recent']: false})
    }
    if(fieldName == 'onlyCharity')
      return setSortBy({...sortBy, ['onlyCharity']: !sortBy.onlyCharity, ['onlyStartup']: false})
    else 
      return setSortBy({...sortBy, ['onlyStartup']: !sortBy.onlyStartup, ['onlyCharity']: false})
  }

  return (
    <div >
      <div className='flex align-top text-lg items-center justify-end min-h-[58px]'>
        <h1 className={`flex-1 font-epilogue font-semibold text-[18px] ${WhiteTheme ? "text-[#010101]": "text-white"} text-left min-w-[150px] `}>{title} ({total})</h1>
        {sortBy && 
        <div className='flex align-top text-lg items-center justify-end'>
          <div className='ml-[60px] w-fit flex align-center'>
              <input 
                name={'sortby-recent'}
                id={'sortby-recent'}
                onChange={(e) => handleSetSortBy('recent', e.target.checked)}
                type={"checkbox"}
                step="0.1"
                className="hidden"
              />
              <label htmlFor={'sortby-recent'} className={`text-[#808191] p-[8px] font-[700] hover:text-[#1dc071] ${sortBy.recent && 'text-[#1dc071]'}`}>Recent </label>
          </div>
          <div className='ml-[16px] w-fit flex align-center'>
              <input 
                name={'sortby-popular'}
                id={'sortby-popular'}
                onChange={(e) => handleSetSortBy('popular', e.target.checked)}
                type={"checkbox"}
                step="0.1"
                className="hidden"
              />
              <label htmlFor={'sortby-popular'} className={`text-[#808191] p-[8px] font-[700] hover:text-[#1dc071] ${sortBy.popular && 'text-[#1dc071]'}`}>Popular </label>
          </div>
          <div className='ml-[16px] w-fit flex align-center'>
              <input 
                name={'sortby-onlyCharity'}
                id={'sortby-onlyCharity'}
                onChange={(e) => handleSetSortBy('onlyCharity', e.target.checked)}
                type={"checkbox"}
                step="0.1"
                className="hidden"
              />
              <label htmlFor={'sortby-onlyCharity'} className={`text-[#808191] p-[8px] font-[700] hover:text-[#1dc071] ${sortBy.onlyCharity && 'text-[#1dc071]'}`}>Charity </label>
          </div>
          <div className='ml-[16px] w-fit flex align-center'>
              <input 
                name={'sortby-onlyStartup'}
                id={'sortby-onlyStartup'}
                onChange={(e) => handleSetSortBy('onlyStartup', e.target.checked)}
                type={"checkbox"}
                step="0.1"
                className="hidden"
              />
              <label htmlFor={'sortby-onlyStartup'} className={`text-[#808191] p-[8px] font-[700] hover:text-[#1dc071] ${sortBy.onlyStartup && 'text-[#1dc071]'}`}>Startup </label>
          </div>
        </div>}
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && projectList.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            {emptyMessage}
          </p>
        )}

        {!isLoading && projectList.length > 0 && 
          projectList.map((projectAddress) => 
            <FundCard 
              key={projectAddress}
              projectAddress = {projectAddress}
              WhiteTheme={WhiteTheme}
              handleClick = { () => { navigate('/' + clickURL + '/' + projectAddress);
              }}
            />)}
      </div>
    </div>
  )
}

export default DisplayProjects