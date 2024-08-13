import { Avatar, Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Gender, UserModel } from "../../../models/user.model";
import { changePassword, getUserFromLocalStorage, saveUserToLocalStorage, updateUser, uploadAvt } from "../../../services/user.service";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from "../../admin/products/CreateProduct";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { UserUpdateDto } from "../../../dtos/requests/user-update.dto";
import AlertCustom from "../../../components/common/AlertCustom";
import { ChangePasswordRequest } from "../../../dtos/requests/change-password-request";



const Profile = () => {

    const user: UserModel | null = getUserFromLocalStorage();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState<string>(user?.name || "");
    const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || "");
    const [gender, setGender] = useState<string>(user?.gender || "");
    const [avt, setAvt] = useState<string>(user?.avatarUrl || "");
    const [street, setStreet] = useState<string>(user?.address?.street || "");
    const [district, setDistrict] = useState<string>(user?.address?.district || "");
    const [city, setCity] = useState<string>(user?.address?.city || "");
    const [dob, setDob] = useState<Dayjs | null>(dayjs(user?.dateOfBirth ? user?.dateOfBirth.toString() : '01-01-1990'));
    const [errName, setErrName] = useState<string>("");
    const [oldPwd, setOldPwd] = useState<string>("");
    const [newPwd, setNewPwd] = useState<string>("");
    const [confirmPwd, setConfirmPwd] = useState<string>("");
    const [errOldPwd, setErrOldPwd] = useState<string>("");
    const [errNewPwd, setErrNewPwd] = useState<string>("");
    const [errConfirmPwd, setErrConfirmPws] = useState<string>("");
    const [openAlert, setOpenAlert] = useState({
        show: false,
        status: '',
        message: ''
    });
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            try {
                const response: ResponseSuccess<string> = await uploadAvt(files[0]);
                setAvt(response.data);
            } catch (error) {
                console.log(error);
            }
            
        }
    }

    const updateInfo = async () => {
        if(name === "") {
            setErrName("Vui lòng nhập tên");
            return;
        } else {
            try {
                let gd : Gender | null = null;
                if(gender === "MALE") {
                    gd = Gender.MALE;
                } else if(gender === "FEMALE") {
                    gd = Gender.FEMALE;
                }
                dob?.add(1, 'day');
                const userUpdateDto: UserUpdateDto = {
                    name: name,
                    avatarUrl: avt,
                    addressDto: {
                        street: street,
                        district: district,
                        city: city
                    },
                    phoneNumber: phoneNumber,
                    gender: gd,
                    dateOfBirth: dob?.add(1, 'day').toDate()
                }
                const response: ResponseSuccess<UserModel> = await updateUser(user?.email || "", userUpdateDto);
                saveUserToLocalStorage(response.data);
                setOpenAlert(
                    {
                        show: true,
                        status: 'success',
                        message: 'cập nhật thành công'
                    }
                )
            } catch (error) {
                setOpenAlert(
                    {
                        show: true,
                        status: 'error',
                        message: 'cập nhật thất bại'
                    }
                )
                console.log(error);
            }
        }
    }

    const colseAlert = () => {
        setOpenAlert(
            {
                show: false,
                status: '',
                message: ''
            }
        )
    }

    const changePwd = async () => {
        if(oldPwd === "") {
            setErrOldPwd("Vui lòng nhập mật khẩu");
            return;
        }
        if(newPwd === "") {
            setErrNewPwd("Vui lòng nhập mật khẩu mới");
            return;
        }
        if(confirmPwd === "") {
            setErrConfirmPws("Vui lòng nhập xác nhận mật khẩu");
            return;
        }
        if(confirmPwd !== newPwd) {
            setErrConfirmPws("Mật khẩu không khớp");
            return;
        }

        try {
            const changePwdRequest : ChangePasswordRequest = {
                email: user?.email || "",
                oldPassword: oldPwd,
                newPassword: newPwd
            }
            await changePassword(changePwdRequest);
            setOpenAlert(
                {
                    show: true,
                    status:'success',
                    message: 'Thay đổi mật khẩu thành công'
                }
            )
        } catch (error) {
            console.log(error);
            setErrOldPwd("Mật khẩu không đúng");
        }
    }

    return <Container>
        {openAlert.show && <AlertCustom alert={openAlert} colseAlert={colseAlert} />}
        <p>Thông tin cá nhân</p>
        <Box sx={{
            pt: 2,
            pb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '10px'
        }}>

            <Avatar alt={name} src={avt} sx={{
                width: 80,
                height: 80,
            }} />

            <Box sx={{ p: 2, pl: 3 }}>
                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Thay ảnh đại diện
                    <VisuallyHiddenInput type="file" accept={"image/*"} onChange={handleChangeImage}/>
                </Button>
            </Box>
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                value={name}
                label="Họ tên"
                name="name"
                onChange={e => setName(e.target.value)}
                error={errName === "" ? false : true}
                helperText={errName}

            />
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                label="Email"
                type="text"
                name="email"
                value={user?.email}
                InputProps={{
                    readOnly: true,
                }}

            />
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                label="Số điện thoại"
                value={phoneNumber}
                type="number"
                name="phoneNumber"
                onChange={e => setPhoneNumber(e.target.value)}

            />
            <FormControl sx={{
                flexBasis: '200px',
                display: 'flex',
                flexGrow: 1
            }}>
                <InputLabel id="gender">Giới tính</InputLabel>
                <Select
                    labelId="gender"
                    label="Giới tính"
                    name="gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}

                >
                    <MenuItem value={"MALE"}>Nam</MenuItem>
                    <MenuItem value={"FEMALE"}>Nữ</MenuItem>

                </Select>

            </FormControl>
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <DatePicker label="Ngày sinh"
                value={dob}
                onChange={(newValue) => setDob(newValue)}
            />

        </Box>

        <Typography sx={{
            pt: 2
        }}>Địa chỉ</Typography>

        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                value={street}
                label="Tên đường"
                name="street"
                onChange={(e) => setStreet(e.target.value)}

            />
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                value={district}
                label="Quận/huyện"
                name="district"
                onChange={(e) => setDistrict(e.target.value)}

            />
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}
                value={city}
                label="Tỉnh/thành phố"
                name="city"
                onChange={(e) => setCity(e.target.value)}

            />
        </Box>

        <Box sx={{
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        }}>
            <Button color="success" variant="outlined" onClick={updateInfo}>Cập nhật thông tin</Button>
        </Box>

        <Typography sx={{
            pt: 2
        }}>Thay đổi mật khẩu</Typography>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flex: 1
                }}
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu cũ"
                name="password"
                value={oldPwd}
                onChange={e => {setOldPwd(e.target.value); setErrOldPwd("")}}
                error={errOldPwd === "" ? false : true}
                helperText={errOldPwd}

                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flex: 1
                }}
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu mới"
                name="password"
                value={newPwd}
                onChange={e => {setNewPwd(e.target.value); setErrNewPwd("")}}
                error={errNewPwd === "" ? false : true}
                helperText={errNewPwd}
            />
        </Box>
        <Box sx={{
            p: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        }}>
            <TextField
                sx={{
                    flex: 1
                }}
                type={showPassword ? 'text' : 'password'}
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                value={confirmPwd}
                onChange={e => {
                    setConfirmPwd(e.target.value);
                    if(e.target.value !== newPwd) {
                        setErrConfirmPws("Xác nhận mật khẩu không khớp");
                    } else {
                        setErrConfirmPws("");
                    }

                }}
                error={errConfirmPwd === "" ? false : true}
                helperText={errConfirmPwd}
            />
        </Box>

        <Box sx={{
            pt: 2,
            pb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        }}>
            <Button variant="outlined" onClick={changePwd}>Thay đổi mật khẩu</Button>

        </Box>

    </Container>
}

export default Profile;