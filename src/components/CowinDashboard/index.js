import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage/index'
import VaccinationByGender from '../VaccinationByGender/index'
import VaccinationByAge from '../VaccinationByAge/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationCoverageData: [],
    apiStatus: apiStatusConstants.initial,
    vaccinationByAgeData: [],
    vaccinationByGenderData: [],
  }

  componentDidMount() {
    this.getCowindetails()
  }

  getCowindetails = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch(vaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const vaccinationCoverage = data.last_7_days_vaccination
      const vaccinationByAge = data.vaccination_by_age
      const vaccinationByGender = data.vaccination_by_gender
      const updatedVaccinationCoverage = vaccinationCoverage.map(vaccine => ({
        vaccineDate: vaccine.vaccine_date,
        Dose1: vaccine.dose_1,
        Dose2: vaccine.dose_2,
      }))
      this.setState({
        vaccinationCoverageData: updatedVaccinationCoverage,
        vaccinationByGenderData: vaccinationByGender,
        vaccinationByAgeData: vaccinationByAge,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.ok === 400) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure">
      <img
        className="failure-pic"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
      />
      <h1 className="failure-msg">Something went wrong</h1>
    </div>
  )

  renderSuccess = () => {
    const {
      vaccinationCoverageData,
      vaccinationByGenderData,
      vaccinationByAgeData,
    } = this.state

    return (
      <div>
        <VaccinationCoverage
          vaccinationCoverageData={vaccinationCoverageData}
        />
        <VaccinationByGender
          vaccinationByGenderData={vaccinationByGenderData}
        />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAgeData} />
      </div>
    )
  }

  renderProcessing = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  getAllVaccinations = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProcessing()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
          />
          <h1 className="title">Co-win</h1>
        </div>
        <h1 className="head">CoWin Vaccination in india</h1>
        {this.getAllVaccinations()}
      </div>
    )
  }
}

export default CowinDashboard
