import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/dashboard">Dashboard</Link> |{' '}
      <Link to="/transactions">Transactions</Link> |{' '}
      <Link to="/recurring-transactions">Reports</Link>
    </nav>
  )
}

export default Navbar