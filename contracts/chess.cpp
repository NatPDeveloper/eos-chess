#include "Chess.hpp"

namespace Game{

    void Chess::addplayer(account_name account, string &username) {
        require_auth(account);

        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator == players.end(), "Address for account already exists");

        players.emplace(account, [&](auto& players) {
            players.account_name = account;
            players.username = username;
            players.moves = {};
        });
    }

    void Chess::getplayer(account_name account){
        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Address for account already exists");

        auto currentPlayer = players.get(account);

        print("Username: ", currentPlayer.username.c_str());
    }

    void Chess::update(account_name account, string& username){
        require_auth(account);

        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Could not find player");
        players.modify(iterator, account, [&](auto& player) {
            player.username = username;
        });
    }


    void Chess::setmove(account_name account, string& move) {
        require_auth(account);

        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Address for account already exists");

        players.modify(iterator, account, [&](auto& player) {
            player.moves.push_back(move);
        });
    }

    void Chess::getmoves(account_name account){
        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Player doesn't exist");

        auto currentPlayer = players.get(account);

        if(currentPlayer.moves.size() > 0) {
            for (uint32_t i = 0; i < currentPlayer.moves.size(); i++) {
                print("Moves: ", currentPlayer.moves.at(i).c_str(), " ");
            };
        } else {
            print(" No Abilities");
        }
    }

}