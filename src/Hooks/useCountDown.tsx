import { useCallback, useEffect, useRef } from 'react'
import useStateRef from 'react-usestateref'

import Utility from '../Helpers/Utility'

const useCountdown = (durationInSeconds: number, onEndEvent?: () => void) => {
  const [, setCountDown, countRef] = useStateRef(durationInSeconds)
  const intervalRef = useRef<null | NodeJS.Timer>(null)

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (countRef.current <= 0 && onEndEvent) {
        onEndEvent()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        setCountDown(countRef.current > 0 ? countRef.current - 1 : 0)
      }
    }, 1000)
  }, [countRef, onEndEvent, setCountDown])

  useEffect(() => {
    startTimer()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTimer])

  const startAgain = useCallback(
    (sec: number) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setCountDown(sec)
      startTimer()
    },
    [setCountDown, startTimer]
  )

  return {
    time: Utility.secondsToMMSS(countRef.current),
    startAgain
  }
}

export default useCountdown
