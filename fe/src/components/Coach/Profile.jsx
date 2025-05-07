import React from 'react';

const Profile = () => (
    <div>
        <form class="row g-3 needs-validation" novalidate>
            <div class="col-md-4">
                <label for="validationCustom01" class="form-label">Họ và Tên</label>
                <input type="text" class="form-control" id="validationCustom01" value="Mark" required/>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
            </div>
            <div class="col-md-4">
                <label for="validationCustom02" class="form-label">Biệt danh</label>
                <input type="text" class="form-control" id="validationCustom02" value="Otto" />
                    <div class="valid-feedback">
                        Looks good!
                    </div>
            </div>
            <div class="col-md-4">
                <label for="validationCustomUsername" class="form-label">Tên đăng nhập</label>
                <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" />
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                </div>
            </div>
            <div class="col-md-6">
                <label for="validationCustom03" class="form-label">Thành phố</label>
                <input type="text" class="form-control" id="validationCustom03" />
                    <div class="invalid-feedback">
                        Please provide a valid city.
                    </div>
            </div>
            <div class="col-md-3">
                <label for="validationCustom04" class="form-label">Giới tính</label>
                <select class="form-select" id="validationCustom04" >
                    <option selected disabled value="">Choose...</option>
                    <option>Nam</option>
                    <option>Nữ</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="validationCustom05" class="form-label">Zip</label>
                <input type="text" class="form-control" id="validationCustom05" />
                    <div class="invalid-feedback">
                        Please provide a valid zip.
                    </div>
            </div>
            <div class="col-12">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="invalidCheck" />
                        <label class="form-check-label" for="invalidCheck">
                            Agree to terms and conditions
                        </label>
                        <div class="invalid-feedback">
                            You must agree before submitting.
                        </div>
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Submit form</button>
            </div>
        </form>
    </div>
);

export default Profile;