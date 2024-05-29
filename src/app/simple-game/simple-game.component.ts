import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../entities/model';
import { onlyPermanentCards, getRandomCard, playCard, playCards, removeCardByName } from '../entities/card';
import { DiceSideType, filterDiceByType, rollDice } from '../entities/dice';
import { findFreeCity, getCitiesNbByPlayers, getOccupiedCities } from '../entities/cities';
import { getCityLeaders, getCurrentPlayer, getPlayersAlive, mockPlayerList } from '../entities/player';
import { getGameConfig, getGameInstance, getGameTurn, hasWinners } from '../entities/game';
import { solveDices } from '../entities/dice.solver';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-leave-city-modal',
  standalone: true,
  templateUrl: './modal.template.html'
})
export class LeaveCityConfirmModal {
  activeModal = inject(NgbActiveModal);
  @Input() name: string = '';
}

@Component({
  selector: 'app-simple-game',
  standalone: true,
  templateUrl: './simple-game.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  styleUrl: './simple-game.component.scss'
})
export class KingOfTokyoComponent {
  gameConfig = getGameConfig();
  gameInstance = getGameInstance([], 0);
  playersForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.playersForm = this.fb.group({
      player: this.fb.array([], Validators.compose([Validators.minLength(this.gameConfig.minPlayers), Validators.maxLength(this.gameConfig.maxPlayers)]))
    });
    this.mockPlayers(); // à remplacer par addPlayer
  }

  logEvent(msg: string, additionalInfo?: any) {
    console.info(msg);
    this.gameInstance.currentTurn.results.push(msg);
    if (additionalInfo) {
      console.log('-> infos: ', additionalInfo);
    }
  }

  
  /**
   * MODAL
   */
  openLeaveCityModal(player: Player) {
    const modalRef = this.modalService.open(LeaveCityConfirmModal)
    modalRef.componentInstance.name = player.name;
    modalRef.result.then(
      (result) => {
        player.cityName = null;
        this.logEvent(`${player.name} a decidé de quitter la ville`);
      },
      (reason) => {
        this.logEvent(`${player.name} a decidé de conserver la ville`);
      });
  }

  /**
   * Players
   */
  get playerFormArray() {
    return this.playersForm.get('player') as FormArray;
  }

  mockPlayers() {
    mockPlayerList.forEach(p => this.addPlayer(p));
  }

  addPlayer(value?: string) {
    this.playerFormArray.push(this.fb.control(value ?? '', Validators.required));
  }

  removePlayer(index: number) {
    this.playerFormArray.removeAt(index);
  }


  /**
   * Dice
   */
  rollDices() {
    if (this.gameInstance.currentTurn.rollsRemaining > 0) {
      this.gameInstance.currentTurn.rollsRemaining--;
      for (const dice of this.gameInstance.currentTurn.diceRolls) {
        rollDice(dice, this.gameConfig.nbSidesDice);
      }
      console.log('roll results', this.gameInstance.currentTurn.diceRolls, 'remaining rolls', this.gameInstance.currentTurn.rollsRemaining);
    } else if (this.gameInstance.currentTurn.rollsRemaining === 0) {
      this.endRoll();
    }
  }

  lockDice(dice: any) {
    if (this.gameInstance.currentTurn.rollsRemaining > 0) {
      dice.locked = !dice.locked;
    }
  }

  endRoll() {
    this.gameInstance.currentTurn.rollsRemaining = 0;
    this.solvePlayerDices();
    this.askCityLeadersToLeave();
  }

  askCityLeadersToLeave() {
    const player = getCurrentPlayer(this.gameInstance.players);
    const attackDices = filterDiceByType(this.gameInstance.currentTurn.diceRolls, DiceSideType.ATTACK);
    if (attackDices.length > 0 && !player?.cityName) {
      getCityLeaders(this.gameInstance.players).forEach(p => {
        this.openLeaveCityModal(p);
      });
    }
  }


  /**
   * Cards
   */
  playCard(card: any) {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player) {
      playCard(card, player, this.gameInstance.players).forEach(r => this.logEvent(r));
      player.cards = removeCardByName(player.cards, card.name);
    }
  }

  applyCardsEffects() {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player) {
      playCards(onlyPermanentCards(player.cards), player, this.gameInstance.players).forEach(r => this.logEvent(r));
    }
  }


  /**
   * Shop
   */
  refreshShopCards() {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player && this.hasEnoughMoney(this.gameConfig.priceToClearShop)) {
      this.withdrawAmount(player, this.gameConfig.priceToClearShop);
      this.gameInstance.cardsToBuy = [];
      this.updateShopCards();
    }
  }

  withdrawAmount(player: Player, amount: number) {
    if (player.energy >= amount) {
      player.energy = player.energy - amount;
    }
  }

  hasEnoughMoney(cardPrice: number) {
    const player = getCurrentPlayer(this.gameInstance.players);
    return player && player.energy > 0 && player.energy >= cardPrice;
  }

  updateShopCards() {
    while (this.gameInstance.cardsToBuy.length < this.gameConfig.cardsInShop) {
      this.gameInstance.cardsToBuy.push(getRandomCard());
    }
  }

  buyCard(card: any) {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player) {
      player.cards.push(card);
      this.withdrawAmount(player, card.price);
      this.logEvent(`${player.name} a acheté la carte ${card.name} pour ${card.price}$`);
      this.gameInstance.cardsToBuy = removeCardByName(this.gameInstance.cardsToBuy, card.name);
      this.updateShopCards();
    }
  }


  /**
   * Game 
   */
  startGame() {
    this.gameInstance = getGameInstance(this.playerFormArray.getRawValue(), this.gameConfig.nbLife);
    this.updateShopCards();
    this.nextTurn();
    this.gameInstance.isGameStarted = true;
  }

  checkVictoryConditions() {
    this.gameInstance.winners = hasWinners(this.gameInstance.players, this.gameConfig.requiredVictoryPoints);
    if (this.gameInstance.winners.length > 0) {
      this.logEvent(`#### ${this.gameInstance.winners[0]} gagne la partie ! #### `);
    }
  }

  solvePlayerDices() {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player) {
      solveDices(player, this.gameInstance.players, this.gameInstance.currentTurn.diceRolls).forEach(r => this.logEvent(r));
    }
  }

  earnCityPoints() {
    const player = getCurrentPlayer(this.gameInstance.players);
    const hasEnteredCity = this.enterCity();
    if (player) {
      if (player.cityName) {
        if (hasEnteredCity) {
          player.points = player.points + 2;
          this.logEvent(`${player.name} gagne 2 points pour être rentré dans la ville ${player.cityName}`);
        } else {
          player.points++;
          this.logEvent(`${player.name} gagne 1 point pour avoir conservé la ville ${player.cityName}`);
        }
      } else {
        this.logEvent(`${player.name} n'est pas en ville`);
      }
    }
  }

  enterCity() {
    const player = getCurrentPlayer(this.gameInstance.players);
    const occupiedCities: string[] = getOccupiedCities(this.gameInstance.players);
    const mustEnterCity = occupiedCities.length != getCitiesNbByPlayers(getPlayersAlive(this.gameInstance.players).length);
    if (player && mustEnterCity) {
      player.cityName = findFreeCity(this.gameInstance.cities, occupiedCities);
      return true;
    }
    return false;
  }

  nextTurn() {
    this.gameInstance.currentTurn = getGameTurn(this.gameConfig.nbSidesDice, this.gameConfig.nbRolls);
  }

  updatePlayerRanks() {
    const player = getCurrentPlayer(this.gameInstance.players);
    if (player) {
      player.rank = this.gameInstance.players.length + 1;
    }
    // We set current player has last player and all the dead players with rank * 10 (to be ignored)
    this.gameInstance.players.forEach((p => { p.rank = p.life > 0 ? p.rank : (p.rank + this.gameInstance.players.length * 10) }));
    this.gameInstance.players.sort((a, b) => a.rank - b.rank);
    this.gameInstance.players.forEach((p, index) => { p.rank = index; });
  }

  endTurn() {
    const player = getCurrentPlayer(this.gameInstance.players);
    this.earnCityPoints();
    this.checkVictoryConditions();
    this.applyCardsEffects();
    if (player) {
      if (player.extraTurn) {
        player.extraTurn = false;
      } else {
        this.updatePlayerRanks();
      }
    }
    this.nextTurn();
  }

}