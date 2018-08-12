#include "Chess.hpp"

namespace Chess{

    void Chess::addplayer(account_name account, string &username) {
        require_auth(account);

        playerIndex players(_self, _self);

        auto iterator = players.find(account);
        eosio_assert(iterator == players.end(), "Address for account already exists");

        players.emplace(account, [&](auto& players) {
            players.account_name = account;
            players.username = username;
            players.match_history = '';
            // other attributes tbd
        });
    }

    void Chess::getmove(account_name account, string& username){

    }

    void Chess::setmove(account_name account, string& username, string& move){

    }

}