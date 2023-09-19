import { NgModule } from '@angular/core';
import {NotifierModule, NotifierOptions} from "angular-notifier";

const customNotifierOptions: NotifierOptions =  {
  position: {

    horizontal: {

      /**
       * Defines the horizontal position on the screen
       * @type {'left' | 'middle' | 'right'}
       */
      position: 'left',

      /**
       * Defines the horizontal distance to the screen edge (in px)
       * @type {number}
       */
      distance: 150

    },

    vertical: {

      /**
       * Defines the vertical position on the screen
       * @type {'top' | 'bottom'}
       */
      position: 'bottom',

      /**
       * Defines the vertical distance to the screen edge (in px)
       * @type {number}
       */
      distance: 12,

      /**
       * Defines the vertical gap, existing between multiple notifications (in px)
       * @type {number}
       */
      gap: 10

    },
  },
    theme: 'material',
    behaviour: {

      /**
       * Defines whether each notification will hide itself automatically after a timeout passes
       * @type {number | false}
       */
      autoHide: 5000,

      /**
       * Defines what happens when someone clicks on a notification
       * @type {'hide' | false}
       */
      onClick: 'hide',

      /**
       * Defines what happens when someone hovers over a notification
       * @type {'pauseAutoHide' | 'resetAutoHide' | false}
       */
      onMouseover: 'pauseAutoHide',

      /**
       * Defines whether the dismiss button is visible or not
       * @type {boolean}
       */
      showDismissButton: true,

      /**
       * Defines whether multiple notification will be stacked, and how high the stack limit is
       * @type {number | false}
       */
      stacking: 4

    },
    animations: {

      /**
       * Defines whether all (!) animations are enabled or disabled
       * @type {boolean}
       */
      enabled: true,

      show: {

        /**
         * Defines the animation preset that will be used to animate a new notification in
         * @type {'fade' | 'slide'}
         */
        preset: 'slide',

        /**
         * Defines how long it will take to animate a new notification in (in ms)
         * @type {number}
         */
        speed: 300,

        /**
         * Defines which easing method will be used when animating a new notification in
         * @type {'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'}
         */
        easing: 'ease'

      },
      hide: {

        /**
         * Defines the animation preset that will be used to animate a new notification out
         * @type {'fade' | 'slide'}
         */
        preset: 'fade',

        /**
         * Defines how long it will take to animate a new notification out (in ms)
         * @type {number}
         */
        speed: 300,

        /**
         * Defines which easing method will be used when animating a new notification out
         * @type {'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'}
         */
        easing: 'ease',

        /**
         * Defines the animation offset used when hiding multiple notifications at once (in ms)
         * @type {number | false}
         */
        offset: 50

      },
      shift: {

        /**
         * Defines how long it will take to shift a notification around (in ms)
         * @type {number}
         */
        speed: 300,

        /**
         * Defines which easing method will be used when shifting a notification around
         * @type {string}
         */
        easing: 'ease' // All standard CSS easing methods work

      },

      /**
       * Defines the overall animation overlap, allowing for much smoother looking animations (in ms)
       * @type {number | false}
       */
      overlap: 150
  }
}
@NgModule({
  imports: [ NotifierModule.withConfig(customNotifierOptions)],
  exports: [ NotifierModule ]
})
export class NotificationModule { }
