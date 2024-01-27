import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  ngOnInit() {
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }
  
  async takeImage() {

    let user = this.user();

    let path = `users/${user.uid}`; //Path unico del usuario

    const dataUrl = (await this.utilsService.takePicture('Imagen del perfil')).dataUrl //Extraer la respuesta
    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = `${user.uid}/profile`;

    user.img = await this.firebaseService.updateImg(imgPath, dataUrl);

    this.firebaseService.updateDocument(path, { img: user.img })
      .then(async resp => {

        this.utilsService.saveLocalStorage('user', user);

        this.utilsService.presentToast({
          message: `Imagen actualizada exitósamente`,
          duration: 1500,
          color: 'primary',
          position: 'bottom',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })

  }

}
