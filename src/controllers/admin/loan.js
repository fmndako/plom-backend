const adminService = require('./../../services/admin/loan')

const getLoans = async (req, res) => {
  const {
    page = 0, limit = 6, userId, startDate, endDate, sortBy, sortStyle = -1
  } = req.query
  const data = {
    limit,
    page,
    query: {},
    sortStyle
  }

  try {
    const validSortBy = ['amount', 'requestedDate']

    if (sortBy && validSortBy.includes(sortBy)) {
      data.sortBy = sortBy
    }

    if (userId) {
      data.query = { userId }
    }

    if (startDate !== '' || endDate !== '') {
      // eslint-disable-next-line no-dupe-keys
      const dateFilter = { datePaid: { $gte: startDate }, datePaid: { $lte: endDate } }
      data.query = { ...data.query, ...dateFilter }
    }

    const loans = await adminService.getLoans(data)
    res.send(loans)
  } catch (error) {
    console.log(error)

    return res.status(500).send({ error: 'Unable to fetch loan request details ' })
  }
}

module.exports = { getLoans }
