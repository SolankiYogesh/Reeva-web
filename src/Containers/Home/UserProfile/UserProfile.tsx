import './style.scss'

import _ from 'lodash'
import React, {
  type ChangeEvent,
  type RefObject,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AlertModal from '../../../Components/AlertModal/AlertModal'
import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppButton from '../../../Components/AppButton/AppButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AppProfileIcon from '../../../Components/AppProfileIcon/AppProfileIcon'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import AppModal from '../../../Components/Modal/AppModal'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { logOut, setUserData } from '../../../Redux/Reducers/UserSlice'

const UserProfile = () => {
  const user = useSelector((state: any) => state?.user?.userData)
  const [isEdit, setISEdit] = useState(false)
  const dispatch = useDispatch()
  const userData = useSelector((state: any) => state?.user?.userData)
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone_number || '')
  const [firstName, setFirstName] = useState(userData?.first_name || '')
  const [lastName, setlastName] = useState(userData?.last_name || '')
  const [brokerName, setBrokername] = useState(userData?.broker?.broker_name || '')
  const [brokerAddress, setbrokerAddress] = useState(userData?.broker?.broker_address || '')
  const [licence, setLicence] = useState(userData?.broker?.broker_license_no || '')
  const [profileUri, setProfileUri] = useState(userData?.profile_image || '')
  const [userLicence, setUserLicence] = useState(userData?.license_no || '')
  const [sLNumber, setSLNumber] = useState(userData?.broker?.supervisor_license_no || '')
  const [PTC, setPTC] = useState(userData?.broker?.title_company || '')
  const [PTCA, setPTCA] = useState(userData?.broker?.title_company_address || '')
  const [address, setAddress] = useState(userData?.address || '')
  const [sName, setSName] = useState(userData?.broker?.supervisor_name || '')
  const [isLogOutModal, setISLogOutModal] = useState(false)
  const navigate = useNavigate()
  // errors
  const [errUserLicence, setErrUserLicence] = useState('')
  const [errPhoneNumber, setErrPhoneNumber] = useState('')
  const [addressError, setAddressError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [brokerNammeError, setBrokerNammeError] = useState('')
  const [brokerAddressError, setBrokerAddressError] = useState('')
  const [sNameError, setSNameError] = useState('')
  const [brokerLincenseError, setBrokerLincenseError] = useState('')
  const [sLNumberError, setSLNumberError] = useState('')
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null)
  const [isModal, setISModal] = useState<any>(null)

  const loaderRef = useRef<AppLoaderRef>(null)

  const styles = useMemo(() => {
    if (isEdit) {
      return {
        borderColor: '#887EF9',
        borderStyle: 'solid',
        borderWidth: 3
      }
    }
  }, [isEdit])

  const onImagePick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setISModal(file)
    }
  }, [])

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onPressSave = useCallback(() => {
    if (!Utility.isEmpty(firstName)) {
      setFirstNameError(English.R52)
      return
    }
    if (!Utility.isEmpty(lastName)) {
      setLastNameError(English.R53)
      return
    }
    if (!Utility.isEmpty(phoneNumber)) {
      setErrPhoneNumber(English.R55)
      return
    }
    if (phoneNumber.length < 14) {
      setErrPhoneNumber(English.R46)
      return
    }
    if (!Utility.isEmpty(userLicence)) {
      setErrUserLicence(English.R54)
      return
    }

    if (!Utility.isEmpty(address)) {
      setAddressError(English.R63)
      return
    }

    if (!Utility.isEmpty(brokerName)) {
      setBrokerNammeError(English.R58)
      return
    }
    if (!Utility.isEmpty(brokerAddress)) {
      setBrokerAddressError(English.R62)
      return
    }
    if (!Utility.isEmpty(licence)) {
      setBrokerLincenseError(English.R54)
      return
    }

    if (!Utility.isEmpty(sName)) {
      setSNameError(English.R60)
      return
    }
    if (!Utility.isEmpty(sLNumber)) {
      setSLNumberError(English.R61)
      return
    }
    if (!Utility.isEmpty(profileUri)) {
      toast.info(English.R103)
      return
    }
    let payload: any = {
      profile_image: {},
      data: {}
    }

    if (profileUri?.name) {
      payload.profile_image = profileUri
    } else {
      payload = _.omit(payload, 'profile_image')
    }

    payload.data = JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email: userData?.email,
      phone_number: phoneNumber,
      address,
      license_no: userLicence,
      broker: {
        broker_name: brokerName,
        broker_address: brokerAddress,
        broker_license_no: licence,
        supervisor_name: sName,
        supervisor_license_no: sLNumber,
        title_company: PTC,
        title_company_address: PTCA
      }
    })

    onLoad(true)

    APICall('put', payload, EndPoints.editProfile, {}, true)
      .then((resp: any) => {
        onLoad(false)

        if (resp?.status === 200) {
          toast.success(resp?.data?.message)

          if (resp?.data?.data) {
            dispatch(setUserData(resp?.data?.data))
          }
          setISEdit(false)
        } else {
          onLoad(false)

          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        onLoad(false)

        toast.error(String(e?.data?.message))
      })
  }, [
    PTC,
    PTCA,
    address,
    brokerAddress,
    brokerName,
    dispatch,
    firstName,
    lastName,
    licence,
    onLoad,
    phoneNumber,
    profileUri,
    sLNumber,
    sName,
    userData?.email,
    userLicence
  ])

  const onClickPencil = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onLogOut = useCallback(() => {
    navigate(Paths.Dashboard)
    dispatch(logOut())
  }, [dispatch, navigate])

  const onPressDeleteAccount = useCallback(async () => {
    setISLogOutModal(false)
    const payload = {
      disable_account: true
    }
    onLoad(true)
    APICall('post', payload, EndPoints.deleteAccount)
      .then((resp: any) => {
        onLoad(false)

        toast.success(resp?.data?.message)
        if (resp?.status === 200) {
          onLogOut()
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        onLoad(false)
      })
  }, [onLoad, onLogOut])

  const onChangePassword = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.ChangePassword)
  }, [navigate])

  return (
    <div className="user-container">
      <div className="user-container--row-view">
        <div className="user-container--row-view profile-view">
          <div className="user-container--row-view profile-picture-view">
            <AppProfileIcon
              borderRadius={184}
              size={184}
              url={profileUri?.name ? URL.createObjectURL(profileUri) : profileUri}
            />
            {isEdit && (
              <div onClick={onClickPencil} className="user-container--row-view pencil-view">
                <img src={Images.pencil} className="user-container--row-view pencil-img" />
              </div>
            )}
          </div>
          <div className="user-container--row-view profile-text-view">
            <span className="user-container--row-view username-text">{`${user?.first_name} ${user?.last_name}`}</span>
            <span className="user-container--row-view changepass-text" onClick={onChangePassword}>
              {English.R92}
            </span>
          </div>
        </div>

        {!isEdit && (
          <AppAnimatedButton
            divId="edit-profile-button"
            isImage={Images.pencil}
            title={English.R93}
            style={styles}
            onClick={() => setISEdit(true)}
          />
        )}
      </div>
      <span className="user-container--row-label">{English.R100}</span>
      <div className="user-container--grid-view">
        <AppInput
          value={firstName}
          onChange={(event) => {
            setFirstNameError('')
            setFirstName(event.target.value)
          }}
          placeholder={English.R34}
          disabled={!isEdit}
          isError={firstNameError}
        />
        <AppInput
          onChange={(event) => {
            setLastNameError('')
            setlastName(event.target.value)
          }}
          value={lastName}
          placeholder={English.R35}
          disabled={!isEdit}
          isError={lastNameError}
        />
        <AppInput
          onChange={(event) => {
            setErrPhoneNumber('')
            setPhoneNumber(
              Utility.formatPhoneNumber(event.target.value.replace(/\D/g, ''), phoneNumber)
            )
          }}
          maxLength={14}
          value={phoneNumber}
          placeholder={English.R94}
          disabled={!isEdit}
          isError={errPhoneNumber}
        />
        <AppInput value={userData?.email} placeholder={English.R37} disabled />
        <AppInput
          onChange={(event) => {
            setErrUserLicence('')
            setUserLicence(event.target.value)
          }}
          value={userLicence}
          placeholder={English.R50}
          disabled={!isEdit}
          isError={errUserLicence}
        />
        <AppInput
          value={address}
          onChange={(event) => {
            setAddressError('')
            setAddress(event.target.value)
          }}
          placeholder={English.R38}
          disabled={!isEdit}
          isError={addressError}
        />
      </div>
      <span className="user-container--row-label">{English.R99}</span>
      <div className="user-container--grid-view">
        <AppInput
          onChange={(event) => {
            setBrokerNammeError('')
            setBrokername(event.target.value)
          }}
          value={brokerName}
          placeholder={English.R69}
          disabled={!isEdit}
          isError={brokerNammeError}
        />
        <AppInput
          onChange={(event) => {
            setBrokerAddressError('')
            setbrokerAddress(event.target.value)
          }}
          value={brokerAddress}
          placeholder={English.R95}
          disabled={!isEdit}
          isError={brokerAddressError}
        />
        <AppInput
          onChange={(event) => {
            setBrokerLincenseError('')
            setLicence(event.target.value)
          }}
          value={licence}
          placeholder={English.R96}
          disabled={!isEdit}
          isError={brokerLincenseError}
        />
        <AppInput
          onChange={(event) => {
            setSNameError('')
            setSName(event.target.value)
          }}
          value={sName}
          placeholder={English.R97}
          disabled={!isEdit}
          isError={sNameError}
        />
        <AppInput
          onChange={(event) => {
            setSLNumberError('')
            setSLNumber(event.target.value)
          }}
          value={sLNumber}
          placeholder={English.R98}
          disabled={!isEdit}
          isError={sLNumberError}
        />
        <AppInput
          onChange={(event) => setPTC(event.target.value)}
          value={PTC}
          placeholder={English.R44}
          disabled={!isEdit}
        />
        <AppInput
          onChange={(event) => setPTCA(event.target.value)}
          value={PTCA}
          placeholder={English.R43}
          disabled={!isEdit}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onImagePick}
        />
      </div>

      {!isEdit ? (
        <AppButton
          onClick={() => setISLogOutModal(true)}
          titleID="delete-button-text"
          divId="delete-button"
          title={English.R101}
        />
      ) : (
        <AppAnimatedButton divId="save-button" onClick={onPressSave} title={English.R102} />
      )}
      <AppModal
        isImage={
          <AppProfileIcon
            borderRadius={20}
            size={300}
            url={isModal && URL.createObjectURL(isModal)}
          />
        }
        containerStyle={{
          minHeight: 300,
          minWidth: 300,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
        buttonStyle={{
          marginTop: 20
        }}
        onPress={() => {
          setProfileUri(isModal)
          setISModal(null)
        }}
        btnText={English.R104}
        isVisible={!!isModal}
        onClose={() => setISModal(null)}
      />
      <AppLoader ref={loaderRef} />
      {isLogOutModal && (
        <AlertModal
          onClose={() => setISLogOutModal(false)}
          cancelText={English.R120}
          deleteText={English.R121}
          alertText={English.R119}
          onPress={onPressDeleteAccount}
        />
      )}
    </div>
  )
}

export default UserProfile
