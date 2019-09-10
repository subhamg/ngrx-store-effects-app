import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/Observable/of';

import * as fromRoot from '../../../app/store';
import * as pizzaActions from '../actions/pizzas.action';
import * as fromServices from '../../services';

@Injectable()
export class PizzasEffects {
  constructor(
    private action$: Actions,
    private pizzaService: fromServices.PizzasService
  ) {}

  @Effect()
  loadPizza$ = this.action$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
    switchMap(() => {
      return this.pizzaService.getPizzas().pipe(
        map((pizzas) => new pizzaActions.LoadPizzasSuccess(pizzas)),
        catchError((error) => of(new pizzaActions.LoadPizzasFail(error)))
      );
    })
  );

  @Effect()
  createPizza$ = this.action$.ofType(pizzaActions.CREATE_PIZZA).pipe(
    map((action: pizzaActions.CreatePizza) => action.payload),
    switchMap((pizza) => {
      return this.pizzaService.createPizza(pizza).pipe(
        map((pizza) => new pizzaActions.CreatePizzaSuccess(pizza)),
        catchError((error) => of(new pizzaActions.CreatePizzaFail(error)))
      );
    })
  );

  @Effect()
  createPizzaSuccess$ = this.action$
    .ofType(pizzaActions.CREATE_PIZZA_SUCCESS)
    .pipe(
      map((action: pizzaActions.CreatePizzaSuccess) => action.payload),
      map(
        (pizza) =>
          new fromRoot.Go({
            path: ['/products', pizza.id]
          })
      )
    );

  @Effect()
  updatePizza$ = this.action$.ofType(pizzaActions.UPDATE_PIZZA).pipe(
    map((action: pizzaActions.UpdatePizza) => action.payload),
    switchMap((pizza) => {
      return this.pizzaService.updatePizza(pizza).pipe(
        map((pizza) => new pizzaActions.UpdatePizzaSuccess(pizza)),
        catchError((error) => of(new pizzaActions.UpdatePizzaFail(error)))
      );
    })
  );

  @Effect()
  removePizza$ = this.action$.ofType(pizzaActions.REMOVE_PIZZA).pipe(
    map((action: pizzaActions.RemovePizza) => action.payload),
    switchMap((pizza) => {
      return this.pizzaService.removePizza(pizza).pipe(
        map(() => new pizzaActions.RemovePizzaSuccess(pizza)),
        catchError((error) => of(new pizzaActions.RemovePizzaFail(error)))
      );
    })
  );

  @Effect()
  handlePizzaSuccess$ = this.action$
    .ofType(
      pizzaActions.UPDATE_PIZZA_SUCCESS,
      pizzaActions.REMOVE_PIZZA_SUCCESS
    )
    .pipe(
      map((pizza) => {
        new fromRoot.Go({
          path: ['/products']
        });
      })
    );
}
