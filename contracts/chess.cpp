#include "chess.hpp"

namespace Game{

    void Chess::setstat(account_name account, string status) {
        require_auth(account);

        // print to node
        print( name{account}, " ", status);
    }

}