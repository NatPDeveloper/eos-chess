#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace Game {
    using namespace eosio;
    using std::string;

    class Chess : public contract {
        using contract::contract;

    public:

        Chess(account_name self): contract(self){}

        //@abi action
        void addplayer(account_name account, string& username);

        //@abi action
        void getplayer(account_name account);

        //@abi action
        void update(account_name account, string& username);

        //@abi action
        void setmove(account_name account, string& move);

        //@abi action
        void getmoves(account_name account);

        //@abi table player i64
        struct player {
            uint64_t account_name;
            string username;
            vector<string> moves;

            uint64_t primary_key() const { return account_name; }

            EOSLIB_SERIALIZE(player,
                    (account_name)
                    (username)
                    (moves)
            )};

        typedef multi_index<N(player), player> playerIndex;
    };

    EOSIO_ABI(Chess, (addplayer)(getplayer)(update)(setmove)(getmoves));
}