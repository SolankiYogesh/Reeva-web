import axios from 'axios'
import _ from 'lodash'

const deepClone = (val: any) => {
  return _.cloneDeep(val)
}

const wait = async (seconds = 1000): Promise<void> => {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, seconds)
  })
}

const isValid = (value: string) => {
  const reg = /\S+@\S+\.\S+/
  return !value.trim() || !reg.test(value.trim())
}

const validatePassword = (password: string) => {
  return password !== '' && password.length >= 5
}

const secondsToMMSS = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19)
}

const getTimeString = () => {
  const currentDate = new Date()
  // Get the current hour
  const currentHour = currentDate.getHours()
  // Determine the time of day based on the current hour
  let timeOfDay

  if (currentHour >= 0 && currentHour < 12) {
    timeOfDay = 'Morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    timeOfDay = 'Afternoon'
  } else if (currentHour >= 18 && currentHour < 24) {
    timeOfDay = 'Evening'
  }

  return timeOfDay
}

const isEmpty = (value: string) => {
  return Boolean(value && _.trim(value))
}

const formateNumber = (number: string) => {
  if (typeof number === 'string' && isEmpty(number)) {
    return number
      .replace(/\D/g, '')
      .replace(/(\d*)(\d{3})(\d{3})(\d{4})$/, (s, a, b, c, d) => `+${a} (${b}) ${c}-${d}`)
      .replace(/\+(1\b|\s)\s*/, '')
  }
  return ''
}

const formatPhoneNumber = (text: string, previousText: string | any[]) => {
  if (!text) return text

  const deleting = previousText && previousText.length > text.length
  if (deleting) {
    return text
  }

  const cleaned = text.replace(/\D/g, '') // remove non-digit characters
  let match = null

  if (cleaned.length > 0 && cleaned.length < 2) {
    return `(${cleaned}`
  }
  if (cleaned.length === 3) {
    return `(${cleaned}) `
  }
  if (cleaned.length > 3 && cleaned.length < 5) {
    match = cleaned.match(/(\d{3})(\d{1,3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}`
    }
  } else if (cleaned.length === 6) {
    match = cleaned.match(/(\d{3})(\d{3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-`
    }
  } else if (cleaned.length > 6) {
    match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  }

  return text
}

const hideEmail = (email: string) => {
  return email.replace(/(.{1})(.*)(?=@)/, (gp1: string, gp2: string, gp3: string) => {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*'
    }
    return gp2
  })
}

const convert = (text: string) => {
  const words = text.split(' ')
  let firstTwoChars = ''
  const filteredWords = words.filter((word: string) => Number.isNaN(Number(word)))

  if (filteredWords.length > 1) {
    const firstLetter = filteredWords[0].match(/[a-zA-Z]/)
    const secondLetter = filteredWords[1].match(/[a-zA-Z]/)
    if (firstLetter && secondLetter) {
      firstTwoChars = firstLetter[0].toUpperCase() + secondLetter[0].toUpperCase()
    } else if (firstLetter) {
      firstTwoChars = firstLetter[0].toUpperCase()
    } else if (secondLetter) {
      firstTwoChars = secondLetter[0].toUpperCase()
    }
  } else {
    const firstTwoLetters = text.match(/[a-zA-Z]{2}/)
    if (firstTwoLetters) {
      firstTwoChars = firstTwoLetters[0].toUpperCase()
    }
  }

  return firstTwoChars || '#'
}

const extractBracketWords = (str: string) => {
  return str.match(/(\[[^\]]+\])/g)
}

const getScope = async (access_token: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json'
        }
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => reject(err))
  })
}

const addSpaceToDollarNumber = (value: string) => {
  return value.replace(/\$(\d+)/g, '$ $1')
}
const Utility = {
  deepClone,
  isValid,
  validatePassword,
  secondsToMMSS,
  getTimeString,

  isEmpty,

  formateNumber,
  formatPhoneNumber,
  hideEmail,
  convert,

  extractBracketWords,
  wait,
  getScope,
  addSpaceToDollarNumber
}

export default Utility
