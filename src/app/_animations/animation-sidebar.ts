import { trigger, state, style, transition, animate, animateChild, query } from '@angular/animations';

const MIN_WIDTH:string = '80px';
const MAX_WIDTH:string = '290px';
const MARGIN_LEFT_CLOSE:string = '80px';
const MARGIN_LEFT_OPEN:string = '290px'

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'width': MIN_WIDTH
    })
  ),
  state('open',
    style({
      'width': MAX_WIDTH
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': MARGIN_LEFT_CLOSE
    })
  ),
  state('open',
    style({
      'margin-left': MARGIN_LEFT_OPEN
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);