
const contributionServices = require('./../services/contribution')

const getContribution = async (req, res) => {
  const data = {
    userId: req.user.id
  }

  try {
    const result = await contributionServices.getContribution(data)

    return res.status(200).json({ result })
  } catch (error) {
    res.status(400)
  }
}

const addContribution = async (req, res) => {
  const data = {
    userId: req.user.id,
    amount: req.body.amount,
    datePaid: req.body.datePaid
  }
  const value = Number(data.amount)

  if ((Number.isNaN(value) || (value === 0))) {
    res.status(400).send({ error: 'Enter a valid amount' })

    return
  }

  if (!data.datePaid) {
    res.status(400).send({ error: 'Enter a valid Date paid; Format: e.g 01 Jan 2019 00:00:00' })

    return
  }

  data.amount = value

  try {
    await contributionServices.addContribution(data)
    res.status(200).send('successfully added')
  } catch (error) {
    res.status(400).send(error)
  }
}

module.exports = {
  getContribution,
  addContribution
}