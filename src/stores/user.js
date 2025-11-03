import { defineStore } from "pinia";
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore";

export default defineStore('user', {
    state: () => ({
        userLoggedIn: false,
    }),

    actions: {
        async register(values) {
            const userCred = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                )

                await updateProfile(userCred.user, {
                    displayName: values.name,
                });

                const user = userCred.user
                alert("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.")
                await sendEmailVerification(user)


                const userDocRef = doc(db, 'users', user.uid)

                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    number: values.nomor,
                    displayName: values.name,
                    role: 'user',
                    createdAt: new Date()
                })

                this.userLoggedIn = true
                console.log(this.userLoggedIn)
        }
    }
}
)