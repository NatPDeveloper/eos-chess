#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace Chess {
    using namespace eosio;
    using std::string;

    class Chess : public contract {
        using contract::contract;

    public:

        Chess(account_name self): contract(self){}

        //@abi table match i64
        struct match {
            uint64_t match_id;
            string opponent;
            string matchID;
            vector<string> board_rec;

            uint64_t primary_key() const { return account_name ; }

            EOSIOLIB_SERIALIZE( match, (account_name)(matchID)(board_rec))
        };

        //@abi table player i64
        struct player {
            uint64_t account_name;
            string username;
            vector<match> match_history;

            uint64_t primary_key() const { return account_name; }

            EOSIOLIB_SERIALIZE( player, (account_name)(username))
        };

        //@abi action
        void addplayer(account_name account, string& username);

        //@abi action
        void getmove(account_name account, string& username);

        //@abi action
        void setmove(account_name account, string& username, string& move);

        tpyedef multi_index<N(player), player> playerIndex;
    };

    EOSIO_ABI(Players, (getmove)(setmove));
}